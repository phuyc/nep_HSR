const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const randomColor = require("../helpers/randomColor");

const info = new EmbedBuilder()
        .setTitle('About')
        .setDescription('[Invite nep to your server](https://discord.com/api/oauth2/authorize?client_id=1099259994920202290&permissions=274878204928&scope=applications.commands%20bot)')
        .setThumbnail('https://preview.redd.it/kt3311mn5bp01.png?auto=webp&s=e420455ca8880f533a66514151a197f0f89adce6')
        .addFields(
                { name: 'Bot Info', value: 'A bot to look up various information from the game Honkai: Star rail\n**Creator:** nepnep'
                    + '\n**Data provided by:** [Prydwen](https://prydwen.gg)', inline: true},
                { name: 'Contact Info', value: `**Discord username:**\nnepnep#1358\n**Join our Discord:** [discord.gg/prydwen](https://discord.gg/prydwen)`, inline: true}
            )
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });
            

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Returns Bot info'),
    execute(interaction) {
        interaction.editReply({ embeds: [info.setColor(randomColor()).setTimestamp()] });
    }
}