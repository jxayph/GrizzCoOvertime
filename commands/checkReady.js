module.exports = {
	name: 'checkready',
    description: 'End registration phase and begin check in phase.',
    detailed: 'Bot will announce to @Registered players that the check in phase is beginning, unless the "-v" flag is invoked.',
	admin: true,
	execute(message, args, globals) {

        globals.readyPhase = !globals.readyPhase;
        console.log(args)
        message.channel.send('Setting `readyPhase` to ' + globals.readyPhase + '.');

        if(!globals.readyPhase || args[0] == '-v') return;

        const channel = globals.client.channels.cache.find(channel => channel.name === 'tournament-announcements');
       
        const messageEmbed = {
            title: "The tournament will begin shortly.",
            fields: [{
                name:'Please use the `!ready` command to show that you are ready to participate!',
                value: 'You can un-ready by calling `!ready` a second time.'
            }],
            footer: {
                text: 'Please ignore this message if you no longer wish to participate.'
            }
        };

        return channel.send('<@&736020303901360128>', {embed: messageEmbed});
	},
};
/*
case 'checkready': // Command to ping registered users to check if they're ready to play
				if (!users[userID].admin) break; //admin only command
				readyOK = true;
				clearReady();
				
				bot.sendMessage({
					to: bot.botChannels['announcements'],
					message:  '<@&' + bot.roles['registered'] +
					'> \n**The tournament will begin shortly.** \nPlease use the `!ready` command to show that you are ready to participate!' +
					'\nPlease ignore this message if you no longer wish to participate.'
					}, function (error, response){
					console.log(error);
				 });
				 
				break;
				*/ 