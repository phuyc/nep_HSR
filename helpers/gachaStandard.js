const Database = require("better-sqlite3");
const db = new Database("./honkai.db");

function gachaStandard(banner, id) {

    let result;
    let rng;
    const results = [];

    // Add user to db if there is no record
    isExist = db.prepare(`SELECT 1 FROM users WHERE user_id=?`).get(id);
    if (!isExist) db.prepare(`INSERT INTO users (user_id) VALUES (?)`).run(id);

    // Roll 10 times
    for (let i = 0; i < 10; i++) {
        let pity4 = db.prepare(`SELECT pity_4_${banner} FROM users WHERE user_id=?`).get(id);
        let pity5 = db.prepare(`SELECT pity_5_${banner} FROM users WHERE user_id=?`).get(id);

        if (pity5[`pity_5_${banner}`] === 89) {
            
            // Return 5* character
            result = db.prepare(`SELECT name FROM ${types[Math.floor(Math.random() * types.length)]} WHERE rarity=5 AND is_gacha IS NULL ORDER BY RANDOM() LIMIT 1`).get();
            results.push(result.name);
            
            // Update pity and skip this roll
            db.prepare(`UPDATE users SET pity_5_${banner}=0 WHERE user_id=?`).run(id);
            continue;
            }

        if (pity4[`pity_4_${banner}`] === 9) {

            // Return 4* character
            result = db.prepare(`SELECT name FROM ${types[Math.floor(Math.random() * types.length)]} WHERE rarity=4 AND is_gacha IS NULL ORDER BY RANDOM() LIMIT 1`).get();
            results.push(result.name);
            
            // Update pity and skip this roll
            db.prepare(`UPDATE users SET pity_4_${banner}=0 WHERE user_id=?`).run(id);
            db.prepare(`UPDATE users SET pity_5_${banner}=pity_5_${banner}+1 WHERE user_id=?`).run(id);
            continue;
        }

        // Get a number from 0 to 100 (just so I can visualize it better)
        rng = Math.random() * 100;

        // 3*
        if (rng >= 0 && rng < standardRates['3']) result = warp3(banner, id);

        // 4*
        if (rng >= standardRates['3'] && rng < standardRates['4']) result = warp4(banner, id);

        // SSR
        if (rng >= standardRates['4'] && rng <= standardRates['5']) result = warp5standard(banner, id);

        results.push(result);
    }

    return results;
}

    
const standardRates = {
    '3': 94.3,
    '4': 99.4,
    '5': 100,
}

const types = ['characters', 'light_cones'];

function warp3(banner, id) {
    let result = db.prepare(`SELECT name FROM light_cones WHERE rarity=3 AND is_gacha IS NULL ORDER BY RANDOM() LIMIT 1`).get();
    
    db.prepare(`UPDATE users SET pity_4_${banner}=pity_4_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_5_${banner}=pity_5_${banner}+1 WHERE user_id=?`).run(id);

    return result.name;
}

function warp4(banner, id) {
    let result = db.prepare(`SELECT name FROM ${types[Math.floor(Math.random() * types.length)]} WHERE rarity=4 AND is_gacha IS NULL ORDER BY RANDOM() LIMIT 1`).get();
    
    db.prepare(`UPDATE users SET pity_4_${banner}=0 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_5_${banner}=pity_5_${banner}+1 WHERE user_id=?`).run(id);

    return result.name;
}

function warp5standard(banner, id) {
    let result = db.prepare(`SELECT name FROM ${types[Math.floor(Math.random() * types.length)]} WHERE rarity=5 AND is_gacha IS NULL ORDER BY RANDOM() LIMIT 1`).get();
    
    db.prepare(`UPDATE users SET pity_4_${banner}=pity_4_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_5_${banner}=0 WHERE user_id=?`).run(id);

    return result.name;
}


module.exports = gachaStandard;