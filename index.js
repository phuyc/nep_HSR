const { GatewayIntentBits } = require("discord.js");
const Discord = require("discord.js")
const fs = require('node:fs');
const path = require('node:path');

require("dotenv").config();

// TODO: clean up honkai.db
// TODO: pick the new light cone and commit (Some just have their name changes)

const client = new Discord.Client({
	intents: [GatewayIntentBits.Guilds, 		
			  GatewayIntentBits.GuildMessages,
			  GatewayIntentBits.MessageContent
		]});

// Read all commands
client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Read all events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.login(process.env.TOKEN);