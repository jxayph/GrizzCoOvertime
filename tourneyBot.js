const BOT_ID = '518861328526606347';
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS'] });
const joots = require('./helpers/joots.js').joots;

let cacheLoaded = false;

const fs = require('fs');
const { errorMessage } = require('./commands/public/register');
const { prefix, token, tourneyGuildID } = require('./config.json');

const publicCommandFiles = fs.readdirSync('./commands/public').filter(file => file.endsWith('.js'));
const funCommandFiles = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();
client.userData = require('./userData.json');

for (const file of publicCommandFiles) {
	const command = require(`./commands/public/${file}`);
	client.commands.set(command.name, command); // Key = command name, value as exported module
}
for (const file of funCommandFiles) {
	const command = require(`./commands/fun/${file}`);
	client.commands.set(command.name, command); // Key = command name, value as exported module
}
for (const file of adminCommandFiles) {
	const command = require(`./commands/admin/${file}`);
	client.commands.set(command.name, command); // Key = command name, value as exported module
}

const globals = { fs, client };
const Player = require('./helpers/Player.js');

// Tournament Variables
globals.readyPhase = false;
globals.tourneyPhase = false;
globals.tourneyDate = new Date(require('./date.json').date); // reconstruct date object from json date string
globals.subQueue = [];

// debug/testing stuff
globals.debug = false;
if (globals.debug) client.userDataDebug = require('./userDataDebug.json'); // debug

// Log in
client.login(token);
client.once('ready', async () => {
	console.log('\nConnected.');
	console.log('Logged in as: ');
	console.log(`${client.user.username} - (${client.user.id})`);
	console.log('Testing info:');
	client.tourneyGuild = await client.guilds.fetch(tourneyGuildID);
	console.log(client.tourneyGuild.name);
	console.log('\n---\n');
});

// Parsing
client.on('messageCreate', async message => {
	if (message.content.includes('jx') || message.content.includes('JX') && !message.author.bot) {
		if (Math.floor(Math.random() * 10) == 0) {
			message.channel.send('<:GoldenEgg:783112272981655574> 👄 <:GoldenEgg:783112272981655574>');
		}
	}
	if (message.content.includes('meat')) {
		message.react('🥦');
	}

	if ((Math.floor(Math.random() * 100) == 0) && !message.author.bot) {
		joots(message);
	}

	if (message.content.includes('<:paog:906395306227298314>') && !message.author.bot) {
		const user = client.userData[message.author.id];
		const PAOG_COST = 3;
		if (user) {
			if (user.balance < PAOG_COST) {
				message.reply('It\'s time to stop. https://www.addictioncenter.com/drugs/gambling-addiction/');
			}
			else {
				user.balance -= PAOG_COST;
				client.userData[BOT_ID].balance += PAOG_COST;
				if (Math.floor(Math.random() * 10) == 0) {
					const rand = Math.floor(Math.random() * 69) + 1;
					user.balance += rand;
					client.userData[BOT_ID].balance -= rand;
					let content = '<@&1080259973998714891>';
					if (rand == 69) {
						content += 'PAOGGERS CHAMPION \n';
						message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(role => role.name === 'paogchamp'));
					}
					for (let i = 0; i < rand; i++) {
						content += ' <:paog:906395306227298314>';
					}
					message.channel.send(content);

				}
				if (Math.floor(Math.random() * 690) == 0) {
					message.channel.send('It\'s time to stop. https://www.addictioncenter.com/drugs/gambling-addiction/');
				}
				fs.writeFile('./userData.json', JSON.stringify(client.userData, null, 4), err => {
					if (err) throw err;
				});
			}
		}

	}
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	if (!cacheLoaded) {
		console.log('Loading cache...');
		await loadCache(message);
		cacheLoaded = true;
	}
	const args = message.content.slice(prefix.length).trim().split(/[\n\s]+/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (!client.commands.has(commandName)) {
		return message.reply('Unrecognized command.');
	}

	if (command.admin && !(message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.name === 'Organizer') || (client.userData[message.author.id] && client.userData[message.author.id].admin))) {
		// if (client.userData[message.author.id] && !client.userData[message.author.id].admin && command.admin) { // Deny admin commands to public
		return message.reply('Unrecognized command. ');
	}

	try {
		await command.execute(message, args, globals);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

async function loadCache(message) {
	const v = false;
	if (message.guild.memberCount == message.guild.members.cache.size) {
		await message.channel.send('Error: cache is already loaded.');
		return;
	}

	await message.guild.members.fetch()
		.then(message.channel.send('Cache loaded.'));
	if (v) {
		message.channel.send(
			`Membercount: ${message.guild.memberCount} \n` +
			`Cached member count ${message.guild.members.cache.size}`,
		);
	}
}