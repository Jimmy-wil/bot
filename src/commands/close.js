const { ROLE_BOSS, ROLE_CALLER } = require('../config');
const { addCloseToUser, getUser } = require('../database/callers');
const { makeProgressBar, getLevelName, getNextLevelMin } = require('../utils/progressBar');

module.exports = {
  name: 'close',
  execute: async (message, args) => {
    if (!message.member.roles.cache.some(r => r.name === ROLE_BOSS))
      return message.reply(`:x: Tu dois avoir le rôle **${ROLE_BOSS}** pour utiliser cette commande.`);

    const mention = message.mentions.users.first();
    if (!mention) return message.reply(':x: Mentionne un caller : `!close @pseudo`');

    const targetMember = await message.guild.members.fetch(mention.id).catch(() => null);
    if (!targetMember) return message.reply(':x: Impossible de récupérer le membre mentionné.');
    if (!targetMember.roles.cache.some(r => r.name === ROLE_CALLER))
      return message.reply(`:x: La personne mentionnée doit avoir le rôle **${ROLE_CALLER}**.`);

    // Ajouter la close
    addCloseToUser(mention.id, `${mention.username}#${mention.discriminator}`);

    // Récupérer les données mises à jour
    const res = getUser(mention.id);

    // Construction de la barre de progression
    const level = getLevelName(res.closes);
    const nextMin = getNextLevelMin(res.closes);
    const barObj = makeProgressBar(res.closes, nextMin, 20);

    // Salon dédié
    const channel = message.guild.channels.cache.find(c => c.name === '🏆-score-board' && c.type === 0);
    if (!channel) return message.reply(':x: Le salon `🏆-score-board` est introuvable.');

    const announce = `🎉 **Close validée !**\n` +
                     `Caller : **${mention.tag}**\n` +
                     `Nouveau total : **${res.closes} closes**\n` +
                     `${mention.username} — **${level}** (${res.closes} closes)\n` +
                     `Progression : [${barObj.bar}] ${Math.round(barObj.ratio * 100)}% (vers ${nextMin} closes)`;

    await channel.send(announce);
  }
};
