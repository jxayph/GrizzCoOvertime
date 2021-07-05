module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		const currentDate = new Date();
		let ms = globals.tourneyDate - currentDate;

		const hours = Math.floor(ms / 1000 / 60 / 60);
		ms -= hours * 60 * 60 * 1000;
		const min = Math.floor(ms / 1000 / 60);

		if (hours <= 0 && min <= 0) return message.channel.send('Registration is closed.');

		return message.channel.send(`Registration will close in ${hours} hour(s) and ${min} minute(s).`);
	},
};