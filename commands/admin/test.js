const Player = require(`../../helpers/Player.js`);
const loadSeed = require(`../../helpers/loadSeed.js`).loadSeed;

module.exports = {
	name: 'test',
    description: 'whatever',
    detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
        for(let i = 0; i < globals.playerCount;i++){
            console.log(globals.players[i]);
        }
	},
};