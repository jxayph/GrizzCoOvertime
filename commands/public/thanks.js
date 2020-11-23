module.exports = {
	name: 'thanks',
	description: 'For the kind souls.',
	detailed: ':)',
	admin: false,
	execute(message, args, globals) {
		message.react('❤️');
		message.reply("You're welcome!");
	},
};