module.exports = {
	name: 'checkready',
	description: 'End registration phase and begin check in phase. Invoke multiple times to toggle back to registration phase.',
	detailed: 'Bot will announce to @Registered players that the check in phase is beginning, unless the "-v" flag is invoked.',
	admin: true,
	execute(message, args, globals) {

		if(globals.tourneyPhase) {
			return message.channel.send('There is currently an active tournament!');
		}

		globals.readyPhase = !globals.readyPhase;
		message.channel.send(`Setting \`readyPhase\` to ${globals.readyPhase}.`);

		if(!globals.readyPhase || args[0] == '-v') return;

		const announcementChannel = globals.client.channels.cache.find(channel => channel.name === 'tournament-announcements');
		const iconURL = 'https://cdn.discordapp.com/avatars/518861328526606347/b2774300463506104c08ee2d878f7459.png?size=128';

		const messageEmbed = {
			title: 'The tournament will begin shortly.',
			thumbnail: {
				url: iconURL,
			},
			fields: [{
				name:'Please use the `!ready` command to show that you are ready to participate!',
				value: 'You can un-ready by calling `!ready` a second time.\nPlease verify that you have the Active Participant role, if you do wish to participate.',
			}],
			footer: {
				text: 'Please ignore this message if you no longer wish to participate.',
				icon_url: iconURL,
			},
		};

		return announcementChannel.send('<@&736020303901360128>', { embed: messageEmbed });
	},
};