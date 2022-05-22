const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'region',
	description: 'Get region roles.',
	detailed: '!pronoun <NA | EU | AUS>',
	admin: false,
	execute(message, args, globals) {
		const pronoun = args[0];
		const member = message.guild.members.cache.get(message.author.id);

		if (pronoun == 'NA') {
			if (member.roles.cache.some(role => role.name === 'NA')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'NA'));
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'NA'));
			}
		}
		else if (pronoun == 'EU') {
			if (member.roles.cache.some(role => role.name === 'EU')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'EU'));
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'EU'));
			}
		}
		else if (pronoun == 'AUS') {
			if (member.roles.cache.some(role => role.name === 'AUS')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'AUS'));
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'AUS'));
			}
		}
		else {
			const text = ':x: Role update unsuccessful.';
			const messageEmbed = new MessageEmbed().setTitle(text);
			return message.channel.send({ embeds: [messageEmbed] });
		}
		const text = ':white_check_mark: Role successfully updated!';
		const messageEmbed = new MessageEmbed().setTitle(text);
		return message.channel.send({ embeds: [messageEmbed] });
	},
};