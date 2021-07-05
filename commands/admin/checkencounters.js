module.exports = {
	name: 'checkencounters',
	description: 'View a player\'s encounter history.',
	detailed: 'Syntax: !viewscore <playerMention>',
	admin: true,
	async execute(message, args, globals) {
		if (!globals.tourneyPhase) {
			return message.channel.send('There is currently no active tournament.');
		}
		if (!message.mentions.users.first()) {
			return await message.channel.send('Please mention a player.');
		}
		const userID = message.mentions.users.first().id;

		const player = globals.players.find(thisPlayer => thisPlayer.userID == userID);
		if (!player) {
			return await message.channel.send('Please mention a participating player.');
		}

		const encounters = player.encounters; // Encounters indexed by userIDs, value is # of times meeting player with that userID
		const pastPlayerIDs = Object.getOwnPropertyNames(encounters);

		for (let i = 0; i < pastPlayerIDs.length; i++) {
			const pastPlayer = globals.players.find(thisPastPlayer => thisPastPlayer.userID == pastPlayerIDs[i]);
			console.log(`Met player ${pastPlayer.IGN} ${encounters[pastPlayerIDs[i]]} times.`);
		}
	},
};