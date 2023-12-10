const Lotto = require('../../helpers/Lotto.js');
const saveLottoData = require('../../helpers/saveLottoData.js').saveLottoData;
const shuffle = require('../../helpers/shuffle.js').shuffle;
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		return;
	},
};

async function thing(message, content) {
	setTimeout(() => {
		message.edit(content);
	}, 3000);
	return message;
}