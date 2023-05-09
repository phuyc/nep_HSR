const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");
const randomColor = require("../helpers/randomColor");

const help = new EmbedBuilder()
.setTitle('List of commands')
.setDescription('/help')
.setThumbnail('https://img-10.stickers.cloud/packs/977bc206-85d3-4882-bd71-a8ab12956a4e/webp/c8bf8419-c2e4-4810-ab71-862dfb67614e.webp')
.addFields(
    { name: '/help', value: 'Displays this message.' },
    { name: '/info', value: 'Displays bot info.' },
    // { name: '/list', value: 'Displays lists of characters or skins.'},
    { name: '/honkai', value: "Looks up various information of a character from the game H:SR." },
    { name: '/lightcone', value: 'Looks up information of a lightcone'},
    { name: '/relic', value: 'Looks up information of a relic set'},
    { name: '/warp', value: 'Simulates a 10-pull'},
    { name: '/ping', value: 'Return latency.' },
)
.setImage('https://dotesports.com/wp-content/uploads/2023/05/image-27.png')
.setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays list of commands'),
    async execute(interaction) {
        await interaction.editReply({ embeds: [help.setColor(randomColor()).setTimestamp()] });
    }
}