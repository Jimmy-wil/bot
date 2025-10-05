const { ROLE_BOSS, ROLE_CALLER } = require('../config');
const { getUser, removeCloseFromUser } = require('../database/callers');
const { makeProgressBar, getLevelName, getNextLevelMin } = require('../utils/progressBar');

module.exports = {
  name: 'revoke',
  execute: async (message, args) => {
    if (!message.member.roles.cache.some(r => r.name === ROLE_BOSS))
      return message.reply(`:x: Tu dois avoir le rôle **${ROLE_BOSS}** pour utiliser cette commande.`);

    const mention = message.mentions.users.first();
    if (!mention) return message.reply(':x: Mentionne un caller : `!revoke @pseudo`');

    const targetMember = await message.guild.members.fetch(mention.id).catch(() => null);
    if (!targetMember) return message.reply(':x: Impossible de récupérer le membre mentionné.');
    if (!targetMember.roles.cache.some(r => r.name === ROLE_CALLER))
      return message.reply(`:x: La personne mentionnée doit avoir le rôle **${ROLE_CALLER}**.`);

    // Retirer une close
    const success = removeCloseFromUser(mention.id);
    if (!success)
      return message.reply(`:x: ${mention.tag} n'a aucune close à retirer.`);

    // Récupérer les données mises à jour
    const user = getUser(mention.id);
    const newCloses = user.closes;
    const newXp = user.xp;

    // Barre de progression
    const level = getLevelName(newCloses);
    const nextMin = getNextLevelMin(newCloses);
    const barObj = makeProgressBar(newCloses, nextMin, 20);

    const channel = message.guild.channels.cache.find(c => c.name === '🏆-score-board' && c.type === 0);
    if (!channel) return message.reply(':x: Le salon `🏆-score-board` est introuvable.');

    const announce = `⚠️ **Close révoquée !**\n` +
                     `Caller : **${mention.tag}**\n` +
                     `Nouveau total : **${newCloses} closes**\n` +
                     `${mention.username} — **${level}** (${newCloses} closes)\n` +
                     `Progression : [${barObj.bar}] ${Math.round(barObj.ratio * 100)}% (vers ${nextMin} closes)`;

    await channel.send(announce);
  }
};
