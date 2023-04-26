const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'pronoun',
	description: 'Get pronoun roles.',
	detailed: '!pronoun <he | she | they | it>',
	admin: false,
	execute(message, args, globals) {
		const pronoun = args[0];
		const member = message.guild.members.cache.get(message.author.id);
		let change = 'changed';

		if (pronoun == 'he') {
			if (member.roles.cache.some(role => role.name === 'he/him')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'he/him'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'he/him'));
				change = 'added';
			}
		}
		else if (pronoun == 'she') {
			if (member.roles.cache.some(role => role.name === 'she/her')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'she/her'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'she/her'));
				change = 'added';
			}
		}
		else if (pronoun == 'they') {
			if (member.roles.cache.some(role => role.name === 'they/them')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'they/them'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'they/them'));
				change = 'added';
			}
		}
		else if (pronoun == 'it') {
			if (member.roles.cache.some(role => role.name === 'it')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'it'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'it'));
				change = 'added';
			}
		}
		else {
			const text = ':x: Role update unsuccessful.';

			const messageEmbed = new MessageEmbed().setTitle(text);
			return message.channel.send({ embeds: [messageEmbed] });
		}
		const text = `:white_check_mark: Role successfully ${change}!`;
		const messageEmbed = new MessageEmbed().setTitle(text);
		return message.channel.send({ embeds: [messageEmbed] });
	},
};