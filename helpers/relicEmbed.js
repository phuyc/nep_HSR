const { EmbedBuilder } = require("discord.js");
const Database = require('better-sqlite3');
const randomColor = require("./randomColor");

const db = new Database('./honkai.db');

async function relicEmbed(name) {
    const response = db.prepare("SELECT * FROM relic_sets WHERE name=?").get(name);

    if (!response) return false;

    // Create embed
    let relic = new EmbedBuilder()
    .setTitle(`${response.name}`)
    .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/star-rail/guides/relic-sets/${response.slug})`)
    .setThumbnail(`https://prydwen.gg${response.image}`)
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
    .addFields(

        // Field 1 (Bonus)
        { name: 'Bonus', value: `(2) ${response.bonus2}\n${response.bonus4 ? `(4) ${response.bonus4}` : ''}`},        
    );

    return relic;
}


module.exports = relicEmbed;




