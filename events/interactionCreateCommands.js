const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.inGuild()) {
			await interaction.reply("Don't try to casually slide into my DM! Add me to your server in order to use my commands.");
			return;
		};

		await interaction.deferReply();

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
};