const { EmbedBuilder } = require("discord.js");
const Database = require('better-sqlite3');
const randomColor = require("./randomColor");
const { PATHS } = require("./emojis")

const db = new Database('./honkai.db')

async function lightConeEmbed(name) {
    const response = db.prepare("SELECT * FROM light_cones WHERE name=?").get(name);

    if (!response) return false;

    // Create embed
    let coneEmbed = new EmbedBuilder()
    .setTitle(`[${'★'.repeat(response.rarity)}] [${PATHS[response.path] ?? response.path}] ${response.name}`)
    .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/star-rail/light-cones/${response.slug})`)
    .setThumbnail(`https://prydwen.gg${response.image}`)
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
    .addFields(

        // Field 1 (STATS)
        { name: 'STATS', value: `<:stat_hp:1098571893449162824> **HP**: ${response.hp} <:stat_atk:1098571923820122222>**ATK**: ${response.atk} <:stat_def:1098571915314069544> **DEF**: ${response.def}`},        
        
        // Field 2 (Description)                  
        { name: 'DESCRIPTION', value: response.skill},
    );

    return coneEmbed;
}


module.exports = { lightConeEmbed };




