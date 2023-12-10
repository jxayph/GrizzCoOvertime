const { MessageEmbed, RichPresenceAssets } = require('discord.js');

module.exports = {
	name: 'curse',
	description: 'Add or remove the `Cursed` role. This role is restricted to users of age 18+.',
	detailed: '!curse <your default username> to assign it, !curse to remove it if you have it.',
	admin: false,
	execute(message, args, globals) {


		const member = message.guild.members.cache.get(message.author.id);
		const userName = member.user.username;
		const roleName = 'Cursed';

		if (member.roles.cache.some(role => role.name === roleName)) {
			member.roles.remove(message.guild.roles.cache.find(role => role.name === roleName));
			const text = '❌ You are no longer cursed VC enabled.';
			const messageEmbed = new MessageEmbed().setTitle(text);
			message.channel.send({ embeds: [messageEmbed] });
			message.react('❌');
			return;
		}
		if (!args[0]) {
			message.reply('For moderation purposes, VC in cursed chats is restricted to users of age 18 and up. If you understand this and are of age, type `!curse <your default username> to confirm and unlock cursed VC.');
		}
		else if (args[0] != userName) {
			message.reply('Invalid username. Please use your default discord username.');
		}
		else {
			member.roles.add(message.guild.roles.cache.find(role => role.name === roleName));
			const text = ':white_check_mark: You are cursed VC enabled!';
			const messageEmbed = new MessageEmbed().setTitle(text);
			message.channel.send({ embeds: [messageEmbed] });
			message.react('✅');
		}
	},
};