module.exports = {
	name: 'say',
	description: 'Eggbot speaks a message to a channel',
	detailed: '!say channel message',
	admin: true,
	execute(message, args, globals) {
		const channel = globals.client.channels.cache.find(channel => channel.id == args[0].slice(2, 20));

		let content = '';
		let i = 1;
		while(args[i]) {
			content += args[i] + ' ';
			i++;
		}
		channel.send(content);

	},
};