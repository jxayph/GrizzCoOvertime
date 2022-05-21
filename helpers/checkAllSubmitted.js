module.exports = {

	checkAllSubmitted(message, globals) {
		let waiting = '';
		for (let i = 0; i < globals.teamCount; i++) {
			if (!globals.submitted[i]) waiting = waiting.concat((i + 1) + ' ');
		}

		if (waiting.length != 0) {
			message.channel.send(`Error! Scores for team(s) ${waiting} have not yet been submitted!`);
			return false;
		}
		return true;

	},
};