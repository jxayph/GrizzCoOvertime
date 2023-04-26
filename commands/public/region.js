const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'region',
	description: 'Get region roles.',
	detailed: '!region <NA | EU | AUS>',
	admin: false,
	execute(message, args, globals) {
		const region = args[0];
		const member = message.guild.members.cache.get(message.author.id);
		let change = 'changed';

		if (region.toUpperCase() == 'NA') {
			if (member.roles.cache.some(role => role.name === 'NA')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'NA'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'NA'));
				change = 'added';
			}
		}
		else if (region.toUpperCase() == 'EU') {
			if (member.roles.cache.some(role => role.name === 'EU')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'EU'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'EU'));
				change = 'added';
			}
		}
		else if (region.toUpperCase() == 'AUS') {
			if (member.roles.cache.some(role => role.name === 'AUS')) { // If the user already has the role
				member.roles.remove(message.guild.roles.cache.find(role => role.name === 'AUS'));
				change = 'removed';
			}
			else {
				member.roles.add(message.guild.roles.cache.find(role => role.name === 'AUS'));
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