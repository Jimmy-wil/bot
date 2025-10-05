const { getUser } = require('../database/callers');
const { getLevelName, getNextLevelMin, makeProgressBar } = require('../utils/progressBar');

module.exports = {
  name: 'profile',
  execute: async (message, args) => {
    const mention = message.mentions.users.first() || message.author;
    const data = getUser(mention.id) || { closes: 0, xp: 0, username: `${mention.username}#${mention.discriminator}` };

    const level = getLevelName(data.closes);
    const nextMin = getNextLevelMin(data.closes);
    const barObj = makeProgressBar(data.closes, nextMin, 20);

    let txt = `📋 **Profil — ${mention.tag}**\n\n`;
    txt += `Closes : **${data.closes}**\n`;
    txt += `Niveau : **${level}**\n`;
    txt += `Progression : [${barObj.bar}] ${Math.round(barObj.ratio * 100)}% (vers ${nextMin} closes)\n`;

    return message.channel.send(txt);
  }
};
