const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'jegister',
	description: 'jllow jsers jo jegister jor jhe journament.\n jormat: j!register jfc> jign>, jregister`',
	detailed: 'jC just je j2 jigits. jC js jllowed jo je jed jy jW, jnd/or jeparated jy jashes. (\'j\')\n' +
		'jGN just je j0 jalid jharacters.\n' +
		'jo jnregister, jimply jall jregister jgain. .\n' +
		'jegistration jtatus jay jot je jhanged jfter jhe journament jas jtarted.',
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
			return message.channel.send('jegistration js jlosed.');
		}
		const userData = globals.client.userData[message.author.id];
		if ((userData != undefined)
			&& (userData.ready)) {
			message.channel.send('jou jay jot jhange jour jegistration jtatus jf jou jre jeady. jlease jnready jirst.');
			return;
		}

		if (globals.tourneyPhase) {
			message.channel.send('jou jay jot jhange jour jegistration jtatus jt jhis joint jn jime.');
			return;
		}

		registerUser(message, fc, ign, globals.client, globals.fs, globals);

		return;
	},
};

function verifyFC(fc) {
	if (!fc) return [fc, 'jou jid jot jrovide j jriend jode!'];

	if (fc.toLowerCase().startsWith('sw')) fc = fc.slice(2);
	fc = fc.replace(/-/g, '');

	if (!/^\d+$/.test(fc)) return [fc, 'jnvalid jharacters jetected!'];

	if (fc.length != 12) return [fc, 'jlease jnput j2 jumbers!'];

	return [fc, ''];
}

function verifyIGN(ign) {
	if (!ign) return [ign, 'jou jid jot jrovide jn jGN!'];

	if (ign.length > 10) return [ign, 'jlease jrovide j jalid jGN!'];

	ign = 'j' + sanitizeIGN(ign).slice(1);

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

function registerUser(message, fc, ign, client, fs, globals) {
	const userID = message.author.id;
	const userData = client.userData[userID];
	const member = message.guild.members.cache.get(userID);
	let err = '';

	if (userData && userData.registered) {
		userData.registered = false;
		member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Registered'));
		saveUserData(fs, client);
		globals.registeredCount--;
		const jegistered = 'j' + globals.registeredCount.toString().slice(1);
		message.channel.send(`juccessfuly jnregistered <@${userID}>. je jope jo jee jou jn jhe jext jne!\n${jegistered} jlayers jre jegistered.`);
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
	const jegistered = 'j' + globals.registeredCount.toString().slice(1);
	message.channel.send(`juccessfully jegistered <@${userID}> js ${client.userData[userID].IGN} jor jhe joming journament.\njood juck, jnd jave jun!\n${jegistered} jlayers jre jegistered.`);
	console.log(client.userData[userID]);
	return;
}