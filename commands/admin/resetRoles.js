const eraseRole = require('../../helpers/eraseRole.js').eraseRole;
const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'resetroles',
	description: 'Reset tournament roles. \n Format: !resetroles <teamCount> {-r}',
	detailed: 'Removes the registered and active participant roles from all users in the server. Only use this after a tournament concludes. Add the -r flag to reset registrants.',
	admin: true,
	async execute(message, args, globals) {
		const teams = args[0];
		const UNREG = (args[1] == '-r');

		if (isNaN(teams)) return message.channel.send('Please enter the number of teams.');

		const deletionList = ['Active Participant', 'Substitute'];

		if (UNREG) { // Check for -r flag, otherwise remove registered role as well.
			deletionList.push('Registered');
			globals.registeredCount = 0;
		}

		if (!isNaN(teams)) {
			for (let i = 0; i < teams; i++) {
				deletionList.push(`Squad ${i + 1}`);
			}
		}

		for (let i = 0; i < deletionList.length; i++) {
			await eraseRole(message, deletionList[i])
				.then(() => message.channel.send(`Erasure of '${deletionList[i]}' complete.`));
		}

		// Remove flags
		const userData = globals.client.userData;
		for (const userID in userData) {
			if (UNREG) userData[userID].registered = false;
			userData[userID].ready = false;
		}
		saveStats(globals);
		saveUserData(globals.fs, globals.client);

		globals.readyPhase = false;
		globals.playerCount = 0;
		globals.tourneyPhase = false;
		globals.postTourney = true;
		globals.subQueue = [];

		console.log('Successfuly reset roles.');
		return message.channel.send('Complete.');
	},
};

function saveStats(globals) {
	const players = globals.players;
	const userData = globals.client.userData;
	if (players && userData) {
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const playerScore = player.getTotalScore();
			const user = userData[player.userID];
			user.tournies = user.tournies + 1;
			user.balance += playerScore;
			user.average = Math.floor(((user.average * user.rounds) + playerScore) / (user.rounds + globals.currentRound + 1));
			user.rounds += globals.currentRound + 1;
		}
	}
	return;
}
