const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { randomColor } = require("./randomColor");
const { PATHS, RATINGS, ELEMENTS } = require('./emojis')

const honkaiMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder().setCustomId('honkai').setOptions([
        { label: 'Skills', value: '1' },
        { label: 'Traces', value: '2'},
        { label: 'Eidolon', value: '3'},
        { label: 'Profile', value: '4'},
        { label: 'Full Design', value: '5'},

    ]))

async function honkaiEmbed(name) {
    const response = await fetch(`https://www.prydwen.gg/page-data/star-rail/characters/${name.replace(/ /g, "-")}/page-data.json`);

    // Send suggestion if can't find the character
    if (response.status != 200) return false;

    let json = response.json();
    json = json.result.data.currentUnit.nodes[0];

    // Create embed
    let skillsEmbed = new EmbedBuilder()
    .setTitle(`[${PATHS[json.path]}] [${ELEMENTS[json.element]}] [${'★'.repeat(response.rarity)}] ${json.name}`)
    .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/star-rail/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
    .setThumbnail(`https://prydwen.gg${json.smallImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
    .addFields(
        // Field 1.1 (Stats)
        { name: 'STATS', value: `<:stat_hp:1098571893449162824> **HP**: ${json.stats.hp_base}\n<:stat_atk:1098571923820122222>**ATK**: ${response.atk_base}`, inline: true },

        // Field 1.2 (Stats)
        { name: '\u200b', value: ` <:stat_def:1098571915314069544> **DEF**: ${json.stats.def_base}\n <:stat_speed:1098571929243373658> **SPD**: ${json.stats.speed_base}` },

        // Field 2 (Ratings)                  
        { name: 'RATINGS', value: `**General:** ${RATINGS[json.ratings.story_late]} **Bossing:** ${RATINGS[json.ratings.bosses]} **Farming:** ${RATINGS[json.ratings.farming]}` },

        // TODO: Field 3 (Skills)
        { name: 'SKILLS', value: '' }
    );

    
    return {
        skills: skillsEmbed,
        traces: tracesEmbed

    }
}


module.exports = { honkaiEmbed };