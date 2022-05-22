const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'announcescores',
	description: 'Announce scores to the server.',
	detailed: 'Sends embed(s) detailing tournament standings for the top 25 players as of whatever round to the announcement channel.',
	admin: true,
	execute(message, args, globals) {

		if (!globals.tourneyPhase) return message.channel.send('There is no active tournament!');

		const iconURL = 'https://cdn.discordapp.com/attachments/746862115817652349/761663223081992222/image0.gif';
		const scoreEmbed = new MessageEmbed()
			.setTitle('Current Tournament Standings')
			.setDescription('Meet your top crewmates!')
			.setThumbnail(iconURL)
			.setTimestamp(new Date())
			.setFooter({
				text: 'Sad you\'re not on the board? Then go get me some more golden eggs!',
				icon_url: iconURL,
			});

		// Get the top 25 players.
		const playerScores = [];
		for (let i = 0; i < globals.players.length; i++) {
			playerScores.push({
				player: globals.players[i],
				score: globals.players[i].getScore(),
			});
		}

		playerScores.sort((player1, player2) => player2.score - player1.score).slice(0, 25);

		for (let i = 0; i < playerScores.length; i++) {
			scoreEmbed.addFields({
				name: `**${(i + 1)}**: ${playerScores[i].player.IGN} - ${playerScores[i].score} golden eggs`,
				value: `${playerScores[i].player.getMention()}`,
			});
		}

		message.channel.send({ embeds: [scoreEmbed] });
	},
};