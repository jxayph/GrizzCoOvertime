module.exports = {
	name: 'checktime',
	description: 'Check how much time is left before the tournament starts.',
	detailed: 'Check how much time is left before the tournament starts.',
	admin: false,
	async execute(message, args, globals) {
		const currentDate = new Date();
		let ms = globals.tourneyDate - currentDate;

		if (ms <= 0) return message.channel.send('Registration is closed.');
		const days = Math.floor(ms / 1000 / 60 / 60 / 24);
		ms -= days * 1000 * 60 * 60 * 24;
		const hours = Math.floor(ms / 1000 / 60 / 60);
		ms -= hours * 60 * 60 * 1000;
		const min = Math.floor(ms / 1000 / 60);
		console.log(`days: ${days} hours: ${hours}, min: ${min}`);

		let txt = 'Registration will close in ';
		if (days > 0 || hours > 0) {
			if (days > 0) {
				if (days == 1) txt += '1 day, ';
				else txt += `${days} days, `;
			}
			if (hours == 1) txt += '1 hour and ';
			else txt += `${hours} hours and `;

			if (min == 1) txt += '1 minute.';
			else txt += `${min} minutes.`;
		}
		else if (min == 1) { txt += '1 minute.'; }
		else if (days == 0 && hours == 0 && min == 0) { txt += 'less than a minute.'; }
		else { txt += `${min} minutes.`; }
		return message.channel.send(`The tournament is scheduled to begin 15 minutes after <t:${Math.round(globals.tourneyDate.getTime() / 1000).toString()}> in your local time.\n` + txt);
	},
};