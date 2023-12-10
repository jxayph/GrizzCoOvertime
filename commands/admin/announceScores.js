const { MessageEmbed } = require('discord.js');
const LIST_LENGTH = 25;

module.exports = {
	name: 'announcescores',
	description: 'Announce scores to the server. Caps at 25 unless more players are specified.',
	detailed: '!announcescores <numPlayers>',
	admin: true,
	execute(message, args, globals) {

		if (!globals.tourneyPhase) return message.channel.send('There is no active tournament!');

		let numPlacements;
		if (args[0] == 'all') {
			numPlacements = globals.playerCount;
		}
		else {
			numPlacements = parseInt(args[0]);
			if (isNaN(numPlacements) || !isFinite(numPlacements)) numPlacements = LIST_LENGTH;
		}
		const playerScores = [];
		for (let i = 0; i < globals.players.length; i++) {
			playerScores.push({
				player: globals.players[i],
				score: globals.players[i].getScore(),
			});
		}

		playerScores.sort((player1, player2) => player2.score - player1.score);

		for (let page = 0; page < (numPlacements / LIST_LENGTH); page++) {
			const offset = page * LIST_LENGTH;
			const iconURL = 'https://cdn.discordapp.com/attachments/746862115817652349/761663223081992222/image0.gif';
			const scoreEmbed = new MessageEmbed()
				.setTitle('Current Tournament Standings')
				.setDescription('Meet your top crewmates!')
				.setThumbnail(iconURL)
				.setTimestamp(new Date())
				.setFooter({
					text: 'Don\'t like where you ended up? Then go get me some more golden eggs!',
					icon_url: iconURL,
				});

			// Get the LIST_LENGTH players on the page.
			const newScores = playerScores.slice(offset, LIST_LENGTH + offset);

			for (let i = 0; i < newScores.length; i++) {
				scoreEmbed.addFields({
					name: `**${(i + 1 + offset)}**: ${newScores[i].player.IGN} - ${newScores[i].score} golden eggs`,
					value: `${newScores[i].player.getMention()}`,
				});
			}

			message.channel.send({ embeds: [scoreEmbed] });
		}
	},
};