module.exports = {
	name: 'setdate',
	description: 'Sets the date for a new tourney.',
	detailed: 'Please input a date in this format, Eastern time centric: MONTH DD, YYYY, HH',
	admin: true,
	execute(message, args, globals) {
		const month = args[0];
		const day = args[1];
		const year = args[2];
		const time = parseInt(args[3]) - 1;

		const newDate = new Date(`${month} ${day} ${year} ${time}:45 `);

		if (newDate == 'Invalid Date') {
			return message.channel.send('Invalid date. Please input a date in this format: MONTH DD, YYYY, HH');
		}

		globals.fs.writeFile('./date.json', JSON.stringify({ date: newDate.toString() }, null, 4), err => { // Save the new date to the local file
			if (err) throw err;
		});

		globals.tourneyDate = newDate;

		return message.channel.send(`The tournament has been scheduled to begin 15 minutes after <t:${Math.round(newDate.getTime() / 1000).toString()}> in your local time.\n`);

	},
};
