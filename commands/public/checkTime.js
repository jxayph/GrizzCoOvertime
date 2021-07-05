module.exports = {
	name: 'checktime',
	description: 'Check how much time is left before the tournament starts.',
	detailed: 'Check how much time is left before the tournament starts.',
	admin: false,
	async execute(message, args, globals) {
		const currentDate = new Date();
		let ms = globals.tourneyDate - currentDate;

		if (ms <= 0) return message.channel.send('Registration is closed.');

		const hours = Math.floor(ms / 1000 / 60 / 60);
		ms -= hours * 60 * 60 * 1000;
		const min = Math.floor(ms / 1000 / 60);
		console.log(`hours: ${hours}, min: ${min}`);


		return message.channel.send(`Registration will close in ${hours} hour(s) and ${min} minute(s).`);
	},
};