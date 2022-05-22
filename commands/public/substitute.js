const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'sub',
	description: 'Register as a substitute player.',
	detailed: 'To toggle sub status, simply call !sub again.\n',
	admin: false,
	execute(message, args, globals) {
		const member = message.guild.members.cache.get(message.author.id);

		if (member.roles.cache.some(role => role.name === 'Active Participant')) { // If the user already has the role
			const text = '❌ You\'re already participating!';
			const messageEmbed = new MessageEmbed().setTitle(text);
			message.channel.send({ embeds: [messageEmbed] });
			message.react('❌');
			return;
		}

		if (member.roles.cache.some(role => role.name === 'Substitute')) { // If the user already has the role
			member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Substitute'));
			const text = '❌ Player has retired.';
			const messageEmbed = new MessageEmbed().setTitle(text);
			message.channel.send({ embeds: [messageEmbed] });
			message.react('❌');
		}
		else {
			member.roles.add(message.guild.roles.cache.find(role => role.name === 'Substitute'));
			const text = ':white_check_mark: Player is ready to fill in!';
			const messageEmbed = new MessageEmbed().setTitle(text);
			message.channel.send({ embeds: [messageEmbed] });
			message.react('✅');
		}

		return;
	},
};
