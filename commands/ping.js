module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: false,
	admin: false,
	execute(message, args) {
		message.channel.send('Pong!');
	},
};