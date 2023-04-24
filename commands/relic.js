const { SlashCommandBuilder } = require("discord.js");
const relicEmbed = require("../helpers/relicEmbed");
const { bestMatch } = require('../helpers/bestMatch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relic')
        .setDescription('Displays the information of a relic set')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('name of the set')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();
        let relic = await relicEmbed(name);

        if (!relic) {
            let match = bestMatch(name, 'relic_sets');

            if (!match) {
                await interaction.editReply({ content: "Couldn't find the target!", ephemeral: true });
                return;
            }

            relic = await relicEmbed(match);
            await interaction.editReply({ embeds: [relic]});
            return;
        }

        await interaction.editReply({ embeds: [relic] });
        return;
    }
}