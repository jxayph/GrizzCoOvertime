const saveLottoData = require('../../helpers/saveLottoData.js').saveLottoData;
const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'lottodraw',
	description: 'Resolves an existing lotto and opens a new lottery.',
	detailed: '!lottoDraw',
	admin: true,
	async execute(message, args, globals) {
		globals.client.lotto.resolve(globals.client.userData, message);

		saveLottoData(globals.fs, globals.client);
		saveUserData(globals.fs, globals.client);
	},
};