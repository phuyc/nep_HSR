const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const sharp = require('sharp');
const Mutex = require("async-mutex").Mutex;
const Database = require("better-sqlite3");
const gachaStandard = require("../helpers/gachaStandard");
const gachaOriented = require("../helpers/gachaOriented");

const TIMEOUT = {};

// Mutex
const mutex = new Mutex();

// DB
const db = new Database('./honkai.db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warp')
        .setDescription('Simulate a 10-pull')
        .addStringOption(option =>
            option.setName('banner')
                .setDescription('Type of banner')
                .setChoices(
                    { name: 'Character Oriented Banner', value: 'characters'},
                    { name: 'Light Cones Oriented Banner', value: 'light_cones'},
                    { name: 'Standard Banner', value: 'standard'},
                )
                .setRequired(true)),
    async execute(interaction) {
        if (TIMEOUT[interaction.user.id]) {
            interaction.editReply(`Please try again in ${5000 - new Date().getTime() + TIMEOUT[interaction.user.id]}ms`);
            return;
        }

        await mutex.runExclusive(async () => {
            const banner = interaction.options.getString('banner');
            
            TIMEOUT[interaction.user.id] = new Date().getTime();
            setTimeout(() => {
                delete TIMEOUT[interaction.user.id];
            }, 5000)

            // Gacha
            let results = [];
            results = banner === 'standard' ? gachaStandard(banner, interaction.user.id) : gachaOriented(banner, interaction.user.id);
            
            // Loop through results
            const images = [];
            for (let i = 0; i < results.length; i++) {
                // ? Add image along with the coordinate to composite
                    if (i < 3) {
                        images.push({
                            input: `./images/assets/cards/${results[i]}.png`,
                            top: 266,
                            left: 71 + 508 * i
                        });
                    } else if (i < 7) {
                        images.push({
                            input: `./images/assets/cards/${results[i]}.png`,
                            top: 586,
                            left: -61 + 508 * (i - 3)
                        });
                    } else {
                        images.push({
                            input: `./images/assets/cards/${results[i]}.png`,
                            top: 906,
                            left: 321 + 508 * (i - 7)
                        });
                    }
                }
            // Composite image
            await sharp("./images/assets/card_template/rotated_background.png")
                .composite(images)
                .toFile(`tmp_${banner}.png`);

            // Rotate image
            await sharp(`./tmp_${banner}.png`)
                .rotate(-15)
                .extract(
                    {
                        left: 274,
                        top: 487,
                        width: 1948,
                        height: 1096,
                })
                .toFile(`./gacha_${banner}.png`);

                const file = new AttachmentBuilder(`./gacha_${banner}.png`);

                let pity5 = db.prepare(`SELECT pity_5_${banner} FROM users WHERE user_id=?`).get(interaction.user.id);
                pity5 = pity5[`pity_5_${banner}`];

                // Send the image
                await interaction.editReply({ content: `<@${interaction.member.id}> Pity count: ${pity5}`, files: [file] });
        })
    }
}