const saveUserData = require('../../helpers/saveUserData.js').saveUserData;
module.exports = {
	name: 'evaluate',
	description: 'Evaluate the quality of a given seed',
	detailed: '!evaluate <playerCount> <rounds>',
	admin: true,
	async execute(message, args, globals) {
		const numPlayers = parseInt(args[0]);
		if (isNaN(numPlayers) || !isFinite(numPlayers)) return message.reply('Invalid number.');
		message.channel.send(`Evaluating conflicts of seed ${numPlayers}.json...`);

		const file = `${numPlayers}.json`;
		const seed = require(`../../seeds/${file}`);
		const playerCount = parseInt(numPlayers);
		const teamCount = Math.ceil(parseInt(numPlayers) / 4);
		const roundCount = seed.length / teamCount / 4;

		let stopRound = args[1];
		if (!stopRound || stopRound >= roundCount) stopRound = roundCount;

		const conflicts = [...Array(playerCount)].map(e => Array(playerCount).fill(0));


		message.channel.send(`${teamCount} teams, checking ${stopRound} out of ${roundCount} rounds.`);

		for (let i = 0; i < seed.length; i++) {
			if ((seed[i] != 'R') && (i < stopRound * teamCount * 4)) { // Randoms don't get logged.
				const player = parseInt(seed[i]);
				const startIdx = Math.floor(i / 4); // Find the start index, of any given team in any given round
				for (let p = 0; p < 4; p++) { // For each player on the team
					let teammate = '';
					if (seed[4 * startIdx + p] == 'R') teammate = playerCount;
					else teammate = parseInt(seed[4 * startIdx + p]);
					if (player != teammate) { // Don't log self encounters
						conflicts[player][teammate]++;
					}
				}
			}
		}
		let messageContent = '';
		for (let i = 0; i < playerCount; i++) {
			conflicts[i][i] = -1;
			let content = `Conflicts for player ${seed[i]}: `;
			for (let j = 0; j < conflicts.length; j++) {
				content += `${conflicts[i][j]}, `;
			}
			messageContent += content + '\n';

			if (messageContent.length > 1000) {
				message.channel.send(messageContent);
				messageContent = '';
			}
		}
		if (messageContent) message.channel.send(messageContent);

	},
};