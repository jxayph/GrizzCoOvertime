const Lotto = require('../../helpers/Lotto.js');
const savePlayerData = require('../../helpers/savePlayerData.js').savePlayerData;
const shuffle = require('../../helpers/shuffle.js').shuffle;
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'logplayers',
	description: 'Write a json log of the current tourney players.',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		savePlayerData(globals.fs, globals.players);
		return message.channel.send('Saving player data!');
	},
};