// module.exports = {
// 	name: 'pb',
// 	description: 'Register a personal best.',
// 	detailed: 'Syntax: !pb <map> <score> optional: <day> <month> <year>',
// 	admin: false,
// 	execute(message, args, globals) {

// 		if (!args[0] && globals.client.userStats[message.author.id]) return message.channel.send({ embed: makePbEmbed(message.author, globals.client.userStats[message.author.id]) });


// 		const map = args[0];
// 		const score = parseInt(args[1]);

// 		if (!['sg', 'lo', 'mb', 'ss', 'ap'].includes(args[0])) return message.channel.send('Please input a map as the first argument. (sg, lo, mb, ss, ap)');
// 		if (isNaN(score)) return message.channel.send('Please input a number.');

// 		registerPB(message, map, score, globals.client, globals.fs);
// 		return;
// 	},
// };

// function registerPB(message, mapCode, score, client, fs) {
// 	const userID = message.author.id;
// 	const userStats = client.userStats[userID];


// 	if (userStats) {
// 		client.userStats[userID][mapCode] = score;
// 	}
// 	else {
// 		const pbs = {
// 			'sg': 0,
// 			'lo': 0,
// 			'mb': 0,
// 			'ss': 0,
// 			'ap': 0,
// 		};
// 		pbs[mapCode] = score;
// 		client.userStats[userID] = pbs;
// 	}

// 	saveUserStats(fs, client);

// 	message.channel.send(`Saved a personal best of ${score} eggs on ${getMapName(mapCode)}. Congrats!`, { embed: makePbEmbed(message.author, client.userStats[userID]) });


// 	console.log(client.userStats[userID]);
// 	return;
// }

// function saveUserStats(fs, client) {
// 	fs.writeFile('./userStats.json', JSON.stringify(client.userStats, null, 4), err => {
// 		if (err) throw err;
// 	});
// }

// function getMapName(mapCode) {
// 	switch (mapCode) {
// 	case 'sg':
// 		return 'Spawning Grounds';
// 	case 'lo':
// 		return 'Lost Outpost';
// 	case 'mb':
// 		return 'Marooner\'s Bay';
// 	case 'ss':
// 		return 'Salmonid Smokeyard';
// 	case 'ap':
// 		return 'Ruins of Ark Polaris';
// 	}
// }

// function makePbEmbed(author, pbs) {
// 	const iconURL = 'https://cdn.discordapp.com/avatars/518861328526606347/b2774300463506104c08ee2d878f7459.png?size=128';
// 	const pbEmbed = {
// 		title: `${author.username}'s Personal Records`,
// 		description: 'I should consider giving you a raise.',
// 		thumbnail: {
// 			url: iconURL,
// 		},
// 		fields: [],
// 		timestamp: new Date(),
// 		footer: {
// 			text: 'Now go out there and get me some golden eggs!',
// 			icon_url: iconURL,
// 		},
// 	};
// 	pbEmbed.fields.push({
// 		name: getMapName('sg'),
// 		value: pbs['sg'],
// 	});
// 	pbEmbed.fields.push({
// 		name: getMapName('lo'),
// 		value: pbs['lo'],
// 	});
// 	pbEmbed.fields.push({
// 		name: getMapName('mb'),
// 		value: pbs['mb'],
// 	});
// 	pbEmbed.fields.push({
// 		name: getMapName('ss'),
// 		value: pbs['ss'],
// 	});
// 	pbEmbed.fields.push({
// 		name: getMapName('ap'),
// 		value: pbs['ap'],
// 	});

// 	return pbEmbed;

// }