module.exports = {
	name: 'ping',
	description: 'Pong! Use this to check to see if I\'m alive.',
	detailed: 'The bot will respond with "Pong!" after this command is called, to let the user know that the bot is still online and responding.',
	admin: false,
	execute(message, args, globals) {
		message.channel.send('<@&858763167408717835>');
	},
};