const Database = require("better-sqlite3");
const stringSimilarity = require('string-similarity');

const db = Database("./honkai.db");

function bestMatch(name, type) {

    // Capitalize name
    if (typeof(name) !== 'string') return;
    name = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

    // Array of employees' name
    const names = [];

    let aliases = db.prepare(`SELECT name FROM ${type};`).all();
    for (let alias of aliases) {
        names.push(alias['name']);
    };

    // Rate similarity
    let bestMatch = stringSimilarity.findBestMatch(name, names).bestMatch;

    if (bestMatch.rating < 0.3) return false;

    let slug = db.prepare(`SELECT name, slug FROM ${type} WHERE name=?;`).get(bestMatch.target);
    
    // Return slug if character
    if (type === 'characters') return slug['slug'];

    // Return name if light cones or relic sets
    return slug['name'];
}

module.exports = { bestMatch }