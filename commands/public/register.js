const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'register',
	description: 'Allow users to register for the tournament.\nFormat: `!register <fc> <ign>, !register`',
	detailed: 'FC must be 12 digits. FC is allowed to be led by SW, and/or separated by dashes. (\'-\')\n' +
		'IGN must be 10 valid characters.\n' +
		'To unregister, simply call !register again.\n' +
		'Registration status may not be changed after the tournament has started.',
	admin: false,
	execute(message, args, globals) {
		const fc = args[0];
		let ign = args[1];

		for (let i = 2; i < args.length; i++) {
			ign += ` ${args[i]}`;
		}

		const currentDate = new Date();
		const ms = globals.tourneyDate - currentDate;
		if (globals.tourneyPhase || ms < -900000) { // If the tourney is underway, or 15 minutes after check in
			return message.channel.send('Registration is closed.');
		}
		const userData = globals.client.userData[message.author.id];
		if ((userData != undefined)
			&& (userData.ready)) {
			message.channel.send('You may not change your registration status if you are ready. Please unready first.');
			return;
		}

		if (globals.tourneyPhase) {
			message.channel.send('You may not change your registration status at this point in time.');
			return;
		}

		registerUser(message, fc, ign, globals.client, globals.fs);

		return;
	},
};

function verifyFC(fc) {
	if (!fc) return [fc, 'You did not provide a friend code!'];

	if (fc.toLowerCase().startsWith('sw')) fc = fc.slice(2);
	fc = fc.replace(/-/g, '');

	if (!/^\d+$/.test(fc)) return [fc, 'Invalid characters detected!'];

	if (fc.length != 12) return [fc, 'Please input 12 numbers!'];

	return [fc, ''];
}

function verifyIGN(ign) {
	if (!ign) return [ign, 'You did not provide an IGN!'];

	if (ign.length > 10) return [ign, 'Please provide a valid IGN!'];

	ign = sanitizeIGN(ign);

	return [ign, ''];
}

function sanitizeIGN(ign) {
	ign = ign
		.replace(/(\/)/g, '\\/')
		.replace(/(\*)/g, '\\*')
		.replace(/(_)/g, '\\_')
		.replace(/(\|)/g, '\\|')
		.replace(/(`)/g, '\\`')
		.replace(/(~)/g, '\\~')
		.replace(/(@)/g, '\\@ ')
		.replace(/(\n)/g, '');
	return ign;
}

function registerUser(message, fc, ign, client, fs) {
	const userID = message.author.id;
	const userData = client.userData[userID];
	const member = message.guild.members.cache.get(userID);
	let err = '';

	if (userData && userData.registered) {
		userData.registered = false;
		member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Registered'));
		saveUserData(fs, client);
		message.channel.send(`Successfuly unregistered <@${userID}>. We hope to see you in the next one!`);
		message.react('✅');
		return;
	}

	[fc, err] = verifyFC(fc);
	if (err) {
		message.channel.send(err);
		return;
	}
	[ign, err] = verifyIGN(ign);
	if (err) {
		message.channel.send(err);
		return;
	}

	const newUserData = {
		'admin': false,
		'registered': true,
		'ready': false,
		'FC': fc,
		'IGN': ign,
		'rounds': 0,
		'average': 0,
		'tournies': 0,
		'wins': 0,
		'balance': 100,
	};
	if (userData) {
		newUserData.admin = userData.admin;
		newUserData.balance = userData.balance;
		newUserData.rounds = userData.rounds;
		newUserData.average = userData.average;
		newUserData.tournies = userData.tournies;
		newUserData.wins = userData.wins;
	}

	client.userData[userID] = newUserData;

	member.roles.add(message.guild.roles.cache.find(role => role.name === 'Registered'));

	saveUserData(fs, client);

	message.channel.send(`Successfully registered <@${userID}> as ${client.userData[userID].IGN} for the coming tournament.\nGood luck, and have fun!`);
	console.log(client.userData[userID]);
	return;
}