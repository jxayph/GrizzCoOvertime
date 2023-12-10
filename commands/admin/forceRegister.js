module.exports = {
	name: 'forceregister',
	description: 'Admin command to register a user.\nFormat: `!forceregister <mention> <fc> <ign>',
	detailed: 'FC must be 12 digits. FC is allowed to be led by SW, and/or separated by dashes. (\'-\')\n' +
		'IGN must be 10 valid characters.\n' +
		'To unregister, simply call !forceregister <mention> again.\n' +
		'Registration status may not be changed after the tournament has started.',
	admin: true,
	execute(message, args, globals) {
		const fc = args[1];
		let ign = args[2];
		const userID = message.mentions.users.first().id;

		for (let i = 3; i < args.length; i++) {
			ign += ` ${args[i]}`;
		}

		registerUser(message, fc, ign, globals.client, globals.fs, userID, globals);

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

function registerUser(message, fc, ign, client, fs, userID, globals) {
	const userData = client.userData[userID];
	const member = message.guild.members.cache.get(userID);
	let err = '';

	if (userData && userData.registered) {
		userData.registered = false;
		member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Registered'));
		saveUserData(fs, client);
		globals.registeredCount--;
		message.channel.send(`Successfuly unregistered <@${userID}>. We hope to see you in the next one!\n${globals.registeredCount} players are registered.`);
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

	globals.registeredCount++;
	message.channel.send(`Successfully registered <@${userID}> as ${client.userData[userID].IGN} for the coming tournament.\nGood luck, and have fun!\n${globals.registeredCount} players are registered.`);
	console.log(client.userData[userID]);
	return;
}

function saveUserData(fs, client) {
	fs.writeFile('./userData.json', JSON.stringify(client.userData, null, 4), err => {
		if (err) throw err;
	});
}