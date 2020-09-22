const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const { prefix, token, tourneyGuildID } = require('./config.json');
client.userData = require('./userData.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command); // Key = command name, value as exported module
}

const globals = {fs, client};

//Tournament Variables
globals.readyPhase = false;
globals.tourneyPhase = false;

client.login(token);
client.once('ready', async () => {
    console.log('\nConnected.');
    console.log('Logged in as: ');
    console.log(client.user.username + ' - (' + client.user.id + ')');
    console.log("Testing info:");
    client.tourneyGuild = await client.guilds.fetch(tourneyGuildID);
    console.log(client.tourneyGuild.name);
    console.log('\n---\n');
});

// Parsing
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!client.commands.has(commandName)){
        return message.reply('Unrecognized command.');
    } 
    if ( (client.userData[message.author.id] != undefined) && !(client.userData[message.author.id].admin) && (command.admin)) { // Deny admin commands to public
        return message.reply('Unrecognized command. ');
    }

    try {
        await command.execute(message, args, globals);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
