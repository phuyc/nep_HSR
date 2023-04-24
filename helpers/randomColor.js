
function randomColor() {
    const colours =  [0xED343E, 0x009EEC, 0xC267EC];
    return colours[Math.floor(Math.random() * colours.length)];
};

module.exports = randomColor;