
const shuffle = require(`./shuffle.js`).shuffle;
module.exports = {
    recycle(globals){ // shuffle players around and extend the seed
        globals.players = shuffle(globals.players);
        globals.seed = globals.seed.concat(globals.seed);
    }
}