const Database = require("better-sqlite3");
const db = new Database("./honkai.db");

function trackPity() {
    let fifty = db.prepare(`SELECT fifty_${banner} FROM users WHERE user_id=?`).get(id);

    if (fifty[`fifty_${banner}`]) db.prepare(`SELECT name FROM ${banner} WHERE name=?`).get(rateUp);
}