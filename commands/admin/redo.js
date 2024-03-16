const Redo = require('../../helpers/Redo.js');

module.exports = {
	name: 'redo',
	description: 'Commands for hosting redos.',
	detailed: '`!redo <add|view|ping|submit> <redoIndex || teamNumber> <score>`. `add` to add a redo to the list, `view` to view the list of redos, `ping` to notify players, and `submit` to run it.',
	admin: true,
	async execute(message, args, globals) {

		if (!globals.tourneyPhase) return message.channel.send('There is currently no active tournament.');

		// if (!args.includes('-x')) return message.channel.send('Under construction');

		switch (args[0]) {

		case 'add': {
			const players = [];
			const teamNumber = parseInt(args[1]);
			if (isNaN(teamNumber) || teamNumber > globals.teamCount || teamNumber < 1) return message.channel.send('Invalid team number.');

			// Find player indexes for this team, retrieve Player objects and populate players property of Redo object.
			const startIdx = 4 * ((globals.currentRound * globals.teamCount) + teamNumber - 1);
			const teamMembers = globals.seed.slice(startIdx, startIdx + 4);

			for (let teamIdx = 0; teamIdx < 4; teamIdx++) {
				if (teamMembers[teamIdx] != 'R') players.push(globals.players[teamMembers[teamIdx]]); // Freelancer is represented by R
			}

			globals.redos.push(new Redo(globals.currentRound, players, globals.redos.length));
			return message.channel.send(`Added new redo for Squad ${teamNumber}, Round ${globals.currentRound + 1} at index ${globals.redos.length}.`);

		}
		case 'view': {
			for (let i = 0; i < globals.redos.length; i++) {
				message.channel.send(globals.redos[i].printRedo());
			}
			break;
		}
		case 'ping': {
			// Parse redo index number
			const redoIndex = parseInt(args[1]) - 1;
			if (isNaN(redoIndex) || redoIndex < 0 || redoIndex >= globals.redos.length) return message.channel.send('Invalid index number.');

			return message.channel.send(globals.redos[redoIndex].mentionPlayers());

		}
		case 'submit': {
			const redoIndex = parseInt(args[1]) - 1;
			if (isNaN(redoIndex) || redoIndex < 0 || redoIndex >= globals.redos.length) return message.channel.send('Invalid index number.');

			const score = parseInt(args[2]); // Score must be a non-negative integer
			if (isNaN(score) || score < 0) return message.channel.send('Invalid score.');

			return message.channel.send(globals.redos[redoIndex].submitRedo(score));
		}
		default: {
			return message.channel.send('Unrecognized command.');
		}
		}
		return;
	},
};