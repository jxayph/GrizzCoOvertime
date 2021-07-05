const Player = require('../../helpers/Player.js');
const loadSeed = require('../../helpers/loadSeed.js').loadSeed;
const shuffle = require('../../helpers/shuffle.js').shuffle;
const setPlayers = require('../../helpers/setPlayers.js').setPlayers;

module.exports = {
	name: 'start',
	description: 'Ends the check-in phase and seeds matchmaking. Users will no longer be able to change registration status, nor ready status.',
	detailed: 'The bot should make an announcement that the check-in period has ended, and that players will soon be sent to their respective lobbies to begin play,'
		+ ' unless the ‘-v’ flag is specified, in which case the announcement shall be suppressed. This command may be rerun with changes made to the RNG seed.',
	admin: true,
	execute(message, args, globals) {

		if (!globals.readyPhase) {
			message.channel.send('The ready phase has not started. Please give players a chance to ready up!');
			return;
		}

		globals.readyPhase = false;
		globals.tourneyPhase = true;
		globals.submitted = [];
		globals.scores = [];
		let data;
		if (globals.debug) data = globals.client.userDataDebug;
		else data = globals.client.userData;

		const filteredData = shuffle(Object.entries(data) // Filter out ready players
			.filter(([userID, playerData]) => playerData.ready));

		globals.playerCount = filteredData.length;
		globals.teamCount = Math.ceil(globals.playerCount / 4);
		if (globals.teamCount < 2) globals.teamCount = 2;
		globals.currentRound = -1;

		for (let i = 0; i < globals.teamCount; i++) {
			globals.submitted.push(true);
		}

		message.channel.send(globals.playerCount + ' ready players.');
		message.channel.send(globals.teamCount + ' teams.');

		loadSeed(filteredData.length, globals); // Load in the corresponding seed to # of ready players
		setPlayers(filteredData, globals); // Build player objects for each ready player

		if (args[0] == '-v') return; // minus verbosity flag

		const channel = globals.client.channels.cache.find(thisChannel => thisChannel.name === 'tournament-announcements');

		const iconURL = 'https://media.discordapp.net/attachments/759237372578627624/759237412034445332/grzzpng.png';

		const messageEmbed = {
			title: 'The tournament will begin very soon!',
			thumbnail: {
				url: iconURL,
			},
			fields: [{
				name: 'You will soon be granted access to your team channels.',
				value: 'You may not change your ready status at this time.',
			}],
			footer: {
				text: 'Now go out there and get me some golden eggs!',
				icon_url: iconURL,
			},
		};


		return channel.send('<@&736689720247058442>', { embed: messageEmbed });
	},
};

