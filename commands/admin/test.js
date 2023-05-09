const Lotto = require('../../helpers/Lotto.js');
const saveLottoData = require('../../helpers/saveLottoData.js').saveLottoData;
module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {

		const userData = globals.client.userData;
		for (const userID in userData) {
			userData[userID].registered = false;
			userData[userID].ready = false;
		}
	},
};