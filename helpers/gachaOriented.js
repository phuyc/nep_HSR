const Database = require("better-sqlite3");
const db = new Database("./honkai.db");

function gachaOriented(banner, id) {

    // Declare variables
    let result;
    let rng;
    const results = [];
    const pityCount5 = banner === 'characters' ? 89 : 79;
    const orientedRates = banner === 'characters' ? characterRates : lightConeRates;

    // Add user to db if there is no record
    isExist = db.prepare(`SELECT 1 FROM users WHERE user_id=?`).get(id);
    if (!isExist) db.prepare(`INSERT INTO users (user_id) VALUES (?)`).run(id);

    // Roll 10 times
    for (let i = 0; i < 10; i++) {

        // Query pity count of 4* and 5* of user
        let pity4 = db.prepare(`SELECT pity_4_${banner} FROM users WHERE user_id=?`).get(id);
        pity4 = pity4[`pity_4_${banner}`];
        let pity5 = db.prepare(`SELECT pity_5_${banner} FROM users WHERE user_id=?`).get(id);
        pity5 = pity5[`pity_5_${banner}`];

        // Query 50/50 status of 4* and 5* of user
        let fifty4 = db.prepare(`SELECT fifty_4_${banner} FROM users WHERE user_id=?`).get(id);
        fifty4 = fifty4[`fifty_4_${banner}`];
        let fifty5 = db.prepare(`SELECT fifty_5_${banner} FROM users WHERE user_id=?`).get(id);
        fifty5 = fifty5[`fifty_5_${banner}`];

        // If reach 5* pity
        if (pity5 === pityCount5) {
            // win 50/50 if user have already lost
            if (fifty5) result = winFifty5(banner, id);
            else result = rng <= 0.5 ? winFifty5(banner, id) : loseFifty5(banner, id);

            // Skip this roll
            results.push(result);
            continue;
        }
        
        // If reach 4* pity
        if (pity4 === 9) {
            // win 50/50 if user have already lost
            if (fifty4) result = winFifty4(banner, id);
            else result = rng <= 0.5 ? winFifty4(banner, id) : loseFifty4(banner, id);

            // Skip this roll
            results.push(result);
            continue;
        }

        // Get a number from 0 to 100 (just so I can visualize it better)
        rng = Math.random() * 100;

        // 3*
        if (rng >= 0 && rng < orientedRates['3']) result = warp3(banner, id);

        // lose 4* 50/50 (unless if user have already lost once)
        if (rng >= orientedRates['3'] && rng < orientedRates['4']) {
            if (!fifty4) result = loseFifty4(banner, id);
            else result = winFifty4(banner, id);
        }

        // win 4* 50/50
        if (rng >= orientedRates['4'] && rng < orientedRates['4up']) result = winFifty4(banner, id);

        // lose 5* 50/50 (unless if user have already lost once)
        if (rng >= orientedRates['4up'] && rng < orientedRates['5']) {
            if (!fifty5) result = loseFifty5(banner, id, pity4);
            else result = winFifty5(banner, id, pity4);
        }

        // win 5* 50/50
        if (rng >= orientedRates['5'] && rng <= orientedRates['5up']) result = winFifty5(banner, id, pity4);

        results.push(result);
    }

    return results;
}
    
const characterRates = {
    '3': 94.3,
    '4': 96.85,
    '4up': 99.4,
    '5': 99.7,
    '5up': 100,
}

const lightConeRates = {
    '3': 92.6,
    '4': 97.55,
    '4up': 99.2,
    '5': 99.4,
    '5up': 100,
}

const types = ['characters', 'light_cones'];

function warp3(banner, id) {
    let result = db.prepare(`SELECT name FROM light_cones WHERE rarity=3 AND is_gacha IS NULL ORDER BY RANDOM() LIMIT 1`).get();
    
    db.prepare(`UPDATE users SET pity_4_${banner}=pity_4_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_5_${banner}=pity_5_${banner}+1 WHERE user_id=?`).run(id);

    return result.name;
}

function loseFifty4(banner, id) {
    let result = db.prepare(`SELECT name FROM ${types[Math.floor(Math.random() * types.length)]} WHERE rarity=4 AND is_gacha IS NULL AND name NOT IN (${"'" + currentUp[banner]['4'].join("', '") + "'"}) ORDER BY RANDOM() LIMIT 1`).get();
    
    db.prepare(`UPDATE users SET pity_4_${banner}=0 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_5_${banner}=pity_5_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET fifty_4_${banner}=true WHERE user_id=?`).run(id);

    return result.name;
}

function winFifty4(banner, id) {
    // Select upped 4* 
    result = currentUp[banner]['4'][Math.floor(Math.random() * currentUp[banner]['4'].length)];

    // Update db
    db.prepare(`UPDATE users SET pity_5_${banner}=pity_5_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_4_${banner}=0 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET fifty_4_${banner}=false WHERE user_id=?`).run(id);

    return result;
}

function loseFifty5(banner, id, pity4) {
    let result = db.prepare(`SELECT name FROM ${banner} WHERE rarity=5 AND is_gacha IS NULL AND NOT name='${currentUp[banner]['5']}' ORDER BY RANDOM() LIMIT 1`).get();
    
    if (pity4 !== 9) db.prepare(`UPDATE users SET pity_4_${banner}=pity_4_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET pity_5_${banner}=0 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET fifty_5_${banner}=true WHERE user_id=?`).run(id);

    return result.name;
}

function winFifty5(banner, id, pity4) {
    // Select up 5* 
    result = currentUp[banner]['5'];

    // Update db
    db.prepare(`UPDATE users SET pity_5_${banner}=0 WHERE user_id=?`).run(id);
    if (pity4 !== 9) db.prepare(`UPDATE users SET pity_4_${banner}=pity_4_${banner}+1 WHERE user_id=?`).run(id);
    db.prepare(`UPDATE users SET fifty_5_${banner}=false WHERE user_id=?`).run(id);

    return result;
}

const currentUp = {
    'characters': {
        '4': ['Hook', 'Natasha', 'Pela'],
        '5': 'Seele'
    },
    'light_cones': {
        '4': ['Post-Op Conversation', 'Good Night and Sleep Well ', 'The Moles Welcome You'],
        '5': 'In the Night'
    }
}


module.exports = gachaOriented;