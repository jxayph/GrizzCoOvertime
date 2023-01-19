const { MessageEmbed, RichPresenceAssets } = require('discord.js');
const Substitute = require('../../helpers/Substitute');
const removeSub = require('../../helpers/removeSub.js').removeSub;

module.exports = {
	name: 'forcesub',
	description: 'Forcefully change a player\'s sub status !forcesub <mention>',
	detailed: 'To toggle sub status, simply call !forcesub again.\n',
	admin: true,
	execute(message, args, globals) {

		const userID = message.mentions.users.first().id;
		const member = message.guild.members.cache.get(userID);

		if (member.roles.cache.some(role => role.name === 'Active Participant')) { // If the user is a participant
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

			removeSub(globals, userID);
		}
		else {
			member.roles.add(message.guild.roles.cache.find(role => role.name === 'Substitute'));
			const text = ':white_check_mark: Player is ready to fill in!';
			const messageEmbed = new MessageEmbed().setTitle(text);
			message.channel.send({ embeds: [messageEmbed] });
			message.react('✅');

			globals.subQueue.push(new Substitute(userID)); // Add user to global subQueue
		}

		return;
	},
};

