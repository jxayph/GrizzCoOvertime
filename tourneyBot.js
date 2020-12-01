const Discord = require('discord.js');
const client = new Discord.Client();

let cacheLoaded = false;

const fs = require('fs');
const { errorMessage } = require('./commands/public/register');
const { prefix, token, tourneyGuildID } = require('./config.json');

const publicCommandFiles = fs.readdirSync('./commands/public').filter(file => file.endsWith('.js'));
const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();
client.userData = require('./userData.json');

for (const file of publicCommandFiles) {
	const command = require(`./commands/public/${file}`);
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
client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}
	
	if (client.userData[message.author.id] != undefined && client.userData[message.author.id].admin && !cacheLoaded) {
		console.log("Loeading cache...");
		await loadCache(message);
		cacheLoaded = true;
	}

	const args = message.content.slice(prefix.length).trim().split(/[\n\s]+/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (!client.commands.has(commandName)) {
		return message.reply('Unrecognized command.');
	}
	if (client.userData[message.author.id] && !client.userData[message.author.id].admin && command.admin) { // Deny admin commands to public
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
	if (message.guild.memberCount == message.guild.members.cache.size) {
		await message.channel.send("Error: cache is already loaded.");
		return;
	}

	await message.guild.members.fetch()
		.then(message.channel.send("Cache loaded."));
	message.channel.send(
		`Membercount: ${message.guild.memberCount} \n` +
		`Cached member count ${message.guild.members.cache.size}`
	);
}