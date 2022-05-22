module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		message.channel.send({ content: `<t:${Math.round(globals.tourneyDate.getTime() / 1000).toString()}>` });
	},
};
