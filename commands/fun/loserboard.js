const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'loserboard',
	description: 'Check out your poorest coworkers',
	detailed: 'Gambling addictions seriously destroy lives. Get help if you need it.',
	admin: false,
	async execute(message, args, globals) {
		const userData = globals.client.userData;
		let balances = [];
		const iconURL = 'https://cdn.discordapp.com/attachments/746862115817652349/761663223081992222/image0.gif';
		const balanceEmbed = new MessageEmbed()
			.setTitle('GCOT Paoverty List')
			.setDescription('Check out your poorest coworkers.')
			.setThumbnail(iconURL)
			.setTimestamp(new Date())
			.setFooter({
				text: 'Gambling addictions seriously destroy lives. Get help if you need it.',
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
		balances = balances.sort((player1, player2) => player1.balance - player2.balance).slice(0, 25);


		for (let i = 0; i < balances.length; i++) {
			balanceEmbed.addFields({
				name: `**${(i + 1)}**: ${balances[i].user} - ${balances[i].balance} golden egg coins`,
				value: ' ',
			});
		}

		message.channel.send({ embeds: [balanceEmbed] });
	},
};
