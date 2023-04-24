const { SlashCommandBuilder } = require("discord.js");
const { lightConeEmbed } = require("../helpers/lightConeEmbed");
const { bestMatch } = require('../helpers/bestMatch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lightcone')
        .setDescription('Displays the information of a light cone')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('name of the light cone')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();
        let cone = await lightConeEmbed(name);
        if (cone) {
            await interaction.editReply({ embeds: [cone] });
            return;
        } else {
            let match = bestMatch(name, 'light_cones');
            if (match) {
                cone = await lightConeEmbed(match);
                await interaction.editReply({ embeds: [cone]});
                return;
            } else {
                await interaction.editReply({ content: "Couldn't find the target!", ephemeral: true });
                return;
            }
        }
    }
}