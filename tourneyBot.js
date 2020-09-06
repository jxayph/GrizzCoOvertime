const Discord = require('discord.js');
const client = new Discord.Client();


const fs = require('fs');
const { prefix, token } = require('./config.json');
client.login(token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command); // Key = command name, value as exported module
}

client.userData = require('./userData.json');

client.once('ready', () => {
    console.log('\nConnected.');
    console.log('Logged in as: ');
    console.log(client.user.username + ' - (' + client.user.id + ')');
    console.log("Testing info:");
    client.guilds.fetch('733336588179734608')
        .then(guild => console.log(guild))
        .catch(console.error);
});


const globals = {fs, client};


// Parsing
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    

    if (!client.commands.has(commandName)){
        return message.reply('Unrecognized command.');
    } else if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    try {
        command.execute(message, args, globals);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});