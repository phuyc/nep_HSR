const { SlashCommandBuilder } = require("discord.js");
const { honkaiEmbed } = require("../helpers/honkaiEmbed");
const { bestMatch } = require('../helpers/bestMatch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('honkai')
        .setDescription('Displays the information of a character')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('name of the character')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();
        
        await interaction.editReply(`This feature is being implemented. Check out the character here instead!\nhttps://www.prydwen.gg/star-rail/characters`)
        return;

        let character = await honkaiEmbed(name);

        if (!character) {
            let match = bestMatch(name, 'characters');

            if (!match) {
                await interaction.editReply({ content: "Couldn't find the target!", ephemeral: true });
                return;
            }

            character = await honkaiEmbed(match);
            await interaction.editReply({ embeds: [character]});
            return;
        }

        await interaction.editReply({ embeds: [character] });
        return;
    }
}