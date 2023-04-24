const fetch = require("node-fetch");
const fs = require('fs')
const Database = require("better-sqlite3");
const sharp = require("sharp");
const db = new Database("./honkai.db");

async function autoUpdate() {
    // Characters
    const CurrentChar = db.prepare("SELECT name FROM characters;").all();

    let characters = await fetch("https://www.prydwen.gg/page-data/star-rail/characters/page-data.json");
    let json2 = await characters.json();
    json2 = json2.result.data.allCharacters.nodes;

    for (let i = 0; i < json2.length; i++) {
        // Add character to db
        if (!CurrentChar.some(char => char.name === json2[i].name)) {

            let char = await fetch(`https://www.prydwen.gg/page-data/star-rail/characters/${json2[i].slug}/page-data.json`)
            let jsonChar = await char.json();
            jsonChar = jsonChar.result.data.currentUnit.nodes;

            // Prepare SQL
            db.prepare("INSERT OR IGNORE INTO characters (name, slug, rarity, is_gacha) VALUES (?, ?, ?, ?, ?);")
                .run(json2[i].name, json2[i].slug, json2[i].rarity, jsonChar.isReleased);

            let resChar = await fetch(`https://www.prydwen.gg${jsonChar.smallImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`);
            resChar.body.pipe(fs.createWriteStream(`./chartmp.png`));
    
            // ! Create card image
            // Resize
            await sharp(`./chartmp.png`)
                .resize({
                    width: 341,
                    height: 238,
                })
                .toFile(`./images/original/characters/${jsonChar.name}.png`);

            // Design
            await sharp(`./images/assets/card_template/${jsonChar.rarity}.png`)
                .composite([
                    {
                        input: `./images/original/characters/${jsonChar.name}.png`,
                        top: 81,
                        left: 213,
                    },
                    {
                        input: `./images/assets/elements/ele_${jsonChar.element}.png`,
                        top: 215,
                        left: 180,
                    },
                ])
                .toFile(`./images/assets/cards/${jsonChar.name}.png`)
                
        }
    }
    // Light cones
    let lightCones = await fetch("https://www.prydwen.gg/page-data/star-rail/light-cones/page-data.json");
    let lCJson = await lightCones.json();
    lCJson = lCJson.result.data.allCharacters.nodes;

    const CurrentLightCones = db.prepare("SELECT name FROM light_cones;").all();

    for (let i = 0; i < lCJson.length; i++) {
        let coneSmallImage = lCJson[i].smallImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src;
        let skill = '';
        let skillDesc = JSON.parse(lCJson[i].skillDescription.raw);
        let skillContents = skillDesc.content[0].content;

        skillContents.forEach(content => {
            if (content.marks[0]) if (content.marks[0].type === 'bold') skill += '**';
            skill += content.value;
            if (content.marks[0]) if (content.marks[0].type === 'bold') skill += '**';
        });

        if (!CurrentLightCones.some(char => char.name === lCJson[i].name)) {
            db.prepare("INSERT OR IGNORE INTO light_cones (name, slug, image, rarity, path, skill, hp, atk, def) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);")
                .run(lCJson[i].name, lCJson[i].slug, coneSmallImage, lCJson[i].rarity, lCJson[i].path, skill, lCJson[i].stats.hp.value_level_max, lCJson[i].stats.atk.value_level_max, lCJson[i].stats.def.value_level_max);
        
            let resCone = await fetch(`https://www.prydwen.gg${coneSmallImage}`);
            resCone.body.pipe(fs.createWriteStream(`./conetmp.png`));
    
            // ! Create card image

            const LEFTS = {
                '3': 166,
                '4': 171,
                '5': 196
            }

            // Resize
            await sharp(`./conetmp.png`)
                .resize({
                    width: 305,
                    height: 320,
                })
                .toFile(`./images/original/light_cones/${lCJson.name}.png`);

            // Design
            await sharp(`./images/assets/card_template/${lCJson.rarity}.png`)
                .composite([
                    {
                        input: `./images/original/light_cones/${lCJson.name}.png`,
                        top: 70,
                        left: 288,
                    },
                    {
                        input: `./images/assets/paths/path_${lCJson.path}.png`,
                        top: 215,
                        left: LEFTS[lCJson.rarity.toString()],
                    },
                ])
                .toFile(`./images/assets/cards/${lCJson.name}.png`)
        }
    }

    // Relic sets
    let relics = await fetch("https://www.prydwen.gg/page-data/star-rail/guides/relic-sets/page-data.json");
    let relicsJson = await relics.json();
    relicsJson = relicsJson.result.data.allCharacters.nodes;

    const CurrentRelics = db.prepare("SELECT name FROM relic_sets;").all();
    for (let i = 0; i < relicsJson.length; i++) {
        // Image
        let relicImage = relicsJson[i].image.localFile.childImageSharp.gatsbyImageData.images.fallback.src;

        let bonus2 = '';
        let bonus4 = '';

        // Bonus2
        let bonus2Desc = JSON.parse(relicsJson[i].bonus2.raw);
        let bonus2Contents = bonus2Desc.content[0].content;
        bonus2Contents.forEach(content => {
            if (content.marks[0]) if (content.marks[0].type === 'bold') bonus2 += '**';
            bonus2 += content.value;
            if (content.marks[0]) if (content.marks[0].type === 'bold' && !bonus2Contents[bonus2Contents.indexOf(content) - 1].marks[0]) bonus2 += '**';
        });

        // Bonus4
        if (relicsJson[i].bonus4) {
            let bonus4Desc = JSON.parse(relicsJson[i].bonus4.raw);
            let bonus4Contents = bonus4Desc.content[0].content;
            bonus4Contents.forEach(content => {
                if (content.marks[0]) if (content.marks[0].type === 'bold') bonus4 += '**';
                bonus4 += content.value;
                if (content.marks[0]) if (content.marks[0].type === 'bold') bonus4 += '**';
            });
        }

        if (!CurrentRelics.some(char => char.name === relicsJson[i].name)) {
            db.prepare("INSERT OR IGNORE INTO relic_sets (name, slug, image, type, element, rarity, bonus2, bonus4) VALUES (?, ?, ?, ?, ?, ?, ?, ?);")
                .run(relicsJson[i].name, relicsJson[i].slug, relicImage, relicsJson[i].type, relicsJson[i].element, relicsJson[i].rarity, bonus2, bonus4)
        }

    }
}

(async () => { await autoUpdate() })();
module.exports = { autoUpdate }