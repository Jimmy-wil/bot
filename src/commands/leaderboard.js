const { getTop } = require('../database/callers');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  execute: async (message, args) => {
    // Récupérer le salon dédié
    const channel = message.guild.channels.cache.find(c => c.name === '🏆-score-board' && c.type === 0);
    if (!channel) return message.reply(':x: Le salon `🏆-score-board` est introuvable.');

    // Récupérer le top 10
    const top = getTop(10);
    if (!top.length) return channel.send('Aucun caller enregistré pour le moment.');

    // Créer l'embed
    const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard — Top 10 Callers 🏆')
      .setColor(0xFFD700) // or
      .setTimestamp()
      .setFooter({ text: 'Scoreboard', iconURL: 'https://i.imgur.com/your-icon.png' });

    // Ajouter chaque utilisateur dans l'embed
    top.forEach((user, i) => {
      embed.addFields({ name: `#${i + 1} — ${user.username}`, value: `${user.closes} closes`, inline: false });
    });

    // Récupérer ou créer un webhook
    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.name === 'Scoreboard Bot');
    if (!webhook) {
      webhook = await channel.createWebhook({
        name: 'Scoreboard Bot',
        avatar: 'https://i.imgur.com/your-avatar.png',
        reason: 'Webhook pour messages du leaderboard'
      });
    }

    // Envoyer l'embed via webhook
    await webhook.send({ embeds: [embed] });
  }
};
