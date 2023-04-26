module.exports = {
	name: 'say',
	description: 'Eggbot speaks a message to a channel',
	detailed: '!say channel message',
	admin: true,
	execute(message, args, globals) {

		const channelID = args[0].slice(2, args[0].length - 1);
		const channel = (globals.client.channels.cache.find(guildChannel => guildChannel.id === channelID));

		if (!channel) return message.reply('Channel not found.');
		let content = '';
		let i = 1;
		while (args[i]) {
			content += args[i] + ' ';
			i++;
		}
		channel.send(content);

	},
};