module.exports = {
	name: 'submit',
	description: 'Submit scores.',
	detailed: 'Syntax: !submit <score> <team> <dcs>, where dcs are the numbers in [1,4] corresponding to members that DC\'d.',
	admin: true,
	execute(message, args, globals) {

		// Return errors if not the right time to be submitting scores.
		if (globals.tourneyPhase == false) {
			return message.channel.send('There is no active tournament.');
		}
		if (globals.currentRound == -1) {
			return message.channel.send('Please start the first round!');
		}

		// Argument parsing
		let score, team;
		const dcs = [];

		if (args[0]) score = args[0];
		else return message.channel.send('Not enough arguments!');

		if (args[1]) team = (args[1] - 1);
		else return message.channel.send('Not enough arguments!');

		for (let i = 2; i < args.length; i++) {
			if (checkDisconnectArg(args[i])) dcs.push(args[i] - 1);
			else message.channel.send('Rejecting disconnect argument, not a number from 1 to 4.');
		}

		if ((args[1] > globals.teamCount) || args[1] == 0) return message.channel.send(`[${args[1]}] is not a valid team number!`);

		// Committing score after validating input arguments
		commmitScore(team, globals, parseInt(score), dcs);
		globals.submitted[team] = true;

		message.channel.send(`Submitted a score of ${score} for Team ${(team + 1)}.`);
		if (dcs.length > 0) message.channel.send(`Team member(s) at index(es) ${dcs} disconnected.`);

		let waiting = '';
		for (let i = 0; i < globals.teamCount; i++) {
			if (!globals.submitted[i]) waiting = waiting.concat((i + 1) + ' ');
		}

		if (waiting == '') message.channel.send('All teams have submitted scores.');
		else message.channel.send(`Awaiting scores from team(s) ${waiting}.`);
		return true;
	},
};

function checkDisconnectArg(playerTeamIdx) {
	const regex = new RegExp(/([1-4])/);
	return (playerTeamIdx.length == 1 && regex.test(playerTeamIdx));

}

function commmitScore(team, globals, score, dcs) {
	const currentRound = globals.currentRound; // Round was advanced in next, so we have to do a local conversion.
	const startIdx = 4 * ((currentRound * globals.teamCount) + team);
	const teamMembers = globals.seed.slice(startIdx, startIdx + 4);

	const hadDisconnect = (dcs.length != 0);
	const hadRandom = teamMembers[3] == 'R';

	for (let i = 0; i < teamMembers.length; i++) {
		if (teamMembers[i] != 'R' && globals.players[teamMembers[i]] != undefined) {
			const player = globals.players[teamMembers[i]];
			player.scores[currentRound] = score;
			player.randoms[currentRound] = hadRandom;

			if (hadDisconnect) {
				if (!dcs.includes(i)) player.teamDC[currentRound] = true;
				else player.teamDC[currentRound] = false;
			}
			else { player.teamDC[currentRound] = false; }
		}
	}
}
