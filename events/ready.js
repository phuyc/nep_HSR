const { Events } = require('discord.js');
const Discord = require('discord.js');  

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('/help for commands', { type: Discord.ActivityType.Playing })
        console.log(`Logged in as ${client.user.tag}`);
        console.log(client.guilds.cache.size);
        console.log(client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c));
	},
};