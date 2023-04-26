const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'profile',
	description: 'View your GCOT stats.',
	detailed: 'See a detailed breakdown of how you\'ve performed.',
	admin: false,
	execute(message, args, globals) {
		const userData = globals.client.userData[message.author.id];
		if (userData) {
			const iconURL = message.author.displayAvatarURL();
			const FC = `SW-${userData.FC.slice(0, 4)}-${userData.FC.slice(4, 8)}-${userData.FC.slice(8, 12)}`;
			const profileEmbed = new MessageEmbed()
				.setTitle(userData.IGN)
				.setDescription('Here are your stats!')
				.setThumbnail(iconURL)
				.setTimestamp(new Date())
				.setFooter({
					text: `${FC}`,
					icon_url: iconURL,
				});

			profileEmbed.addFields(
				{ name: 'Tournaments participated in', value: `${userData.tournies}` },
				{ name: 'Tournaments won', value: `${userData.wins}` },
				{ name: 'Average score per round', value: `${userData.average}` },
				{ name: 'Golden Egg balance', value: `${userData.balance}` },
			);
			message.channel.send({ embeds: [profileEmbed] });
		}
		else {
			return message.reply('You are not registered.');
		}
	},
};
