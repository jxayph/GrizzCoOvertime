const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'leaderboard',
	description: 'Check out your richest coworkers.',
	detailed: 'Do you have what it takes to reach the top?',
	admin: false,
	async execute(message, args, globals) {
		const userData = globals.client.userData;
		let balances = [];
		const iconURL = 'https://cdn.discordapp.com/attachments/746862115817652349/761663223081992222/image0.gif';
		const balanceEmbed = new MessageEmbed()
			.setTitle('GCOT Sunshine List')
			.setDescription('Check out the richest amongst you!')
			.setThumbnail(iconURL)
			.setTimestamp(new Date())
			.setFooter({
				text: 'Sad you\'re not on the board? Then go get me some more golden eggs!',
				icon_url: iconURL,
			});

		for (const userID in userData) {
			const member = message.guild.members.cache.get(userID);
			if (member) {
				balances.push({
					user: message.guild.members.cache.get(userID).displayName,
					balance: userData[userID].balance,
				});
			}
		}
		balances = balances.sort((player1, player2) => player2.balance - player1.balance).slice(0, 25);


		for (let i = 0; i < balances.length; i++) {
			balanceEmbed.addFields({
				name: `**${(i + 1)}**: ${balances[i].user} - ${balances[i].balance} golden egg coins`,
				value: ' ',
			});
		}

		message.channel.send({ embeds: [balanceEmbed] });
	},
};
