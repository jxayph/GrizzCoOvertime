const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
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

const globals = {fs, client};
const Player = require('./helpers/Player.js');

//Tournament Variables
globals.readyPhase = false;
globals.tourneyPhase = false;

//debug/testing stuff
globals.seed = ("0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15," +
                "0,7,11,13,1,4,8,14,2,6,10,15,3,5,9,12," +
                "0,4,10,12,1,7,9,15,2,5,11,14,3,6,8,13," +
                "0,6,9,14,1,5,10,13,2,7,8,12,3,4,11,15," +
                "0,5,8,15,1,6,11,12,2,4,9,13,3,7,10,14").split(',');
setValues();
function setValues(){
    globals.teamCount = 4;
    globals.playerCount = 16;
    globals.roundCount = 5;
    globals.currentRound = -1;
    globals.players = [];
    for (let i = 0; i < globals.playerCount; i++){
        globals.players[i] = new Player(i);
    }
}

client.userDataDebug = require('./userDataDebug.json'); // debug

//debug ends here?


client.login(token);
client.once('ready', async () => {
    console.log('\nConnected.');
    console.log('Logged in as: ');
    console.log(`${client.user.username} - (${client.user.id})`);
    console.log("Testing info:");
    client.tourneyGuild = await client.guilds.fetch(tourneyGuildID);
    console.log(client.tourneyGuild.name);
    console.log('\n---\n');
});

// Parsing
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot){
        return;
    };
    
    const args = message.content.slice(prefix.length).trim().split(/[\n\s]+/);
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



