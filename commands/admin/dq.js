const loadSeed = require('../../helpers/loadSeed.js').loadSeed;
const shuffle = require('../../helpers/shuffle.js').shuffle;
const setPlayers = require('../../helpers/setPlayers.js').setPlayers;

module.exports = {
	name: 'dq',
	description: 'Eliminate a player from the tournament. This cannot be undone.',
	detailed: 'Syntax: !dq <playerMention>',
	admin: true,
	async execute(message, args, globals) {
		/*
		To DQ a player, we must remove them from the ready players list and then reseed the matchmaking.
		*/

		const userID = message.mentions.users.first().id;// Find the player to DQ
		const dQPlayer = globals.players.find(thisPlayer => thisPlayer.userID == userID);

		if (!dQPlayer) { // Catch improper mentions
			return await message.channel.send('Please mention a participating player.');
		}

		const userData = globals.client.userData[userID];// userData from JSON
		const member = message.guild.members.cache.get(userID);// guildMember object from API

		member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Active Participant'));// Remove tournament related roles
		member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Registered'));
		userData.ready = false; // Unready; remove from the tournament

		console.log(`DQ player ${userData.IGN}`);
		const text = `:x: Player ${userData.IGN}  has been removed from the tournament.`; // Feedback
		const messageEmbed = {
			title: text,
		};
		message.channel.send({ embed: messageEmbed });

		const data = globals.client.userData;
		const filteredData = shuffle(Object.entries(data) // Recalculate ready players
			.filter(([thisUserID, playerData]) => playerData.ready));

		globals.playerCount = filteredData.length;
		globals.teamCount = Math.ceil(globals.playerCount / 4);
		if (globals.teamCount < 2) globals.teamCount = 2;

		message.channel.send('Recalculating seed with ' + globals.playerCount + ' ready players.');

		const file = `${filteredData.length}.json`;// Load in smaller seed; throw it somewhere on the current seed that makes sense.
		const newSeed = require(`../../seeds/${file}`);

		const startIdx = 4 * ((globals.currentRound * globals.teamCount));

		console.log(`globals.seed = ${globals.seed}`);
		console.log(typeof (globals.seed));
		globals.seed = globals.seed.slice(0, startIdx).concat(newSeed);

		setPlayers(filteredData, globals); // FUCKUP; ASSIGNING NEW PLAYERS INSTEAD OF REUSING OLD ONES

	},
};