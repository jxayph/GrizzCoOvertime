module.exports = {
	name: 'adminhelp',
	description: 'Provides a list of admin commands. Use !help <command> for more details.',
	detailed: 'If you\'re still confused, please ping JX or read the admin docs',
	admin: true,
	execute(message, args, globals) {
		const publicCommands = globals.client.commands.filter(command => command.admin == true);
		const iconURL = 'https://media.discordapp.net/attachments/759237372578627624/759237412034445332/grzzpng.png';
		const docURL = 'https://tinyurl.com/GrizzCoOvertime';
		if(args.length == 0){ 
			const commandInfo = [];			
			
			for (let command of publicCommands.values()){
				commandInfo.push({
					name: command.name,
					value: command.description
				})
			}
			const helpEmbed = {
				title: 'Command List',
				url: docURL,
				description: 'For more details, please call !adminhelp <command>.',
				thumbnail: {
					url: iconURL,
				},
				fields: commandInfo,
				timestamp: new Date(),
				footer: {
					text: 'Now go out there and get me some golden eggs!',
					icon_url: iconURL,
				},
			};

			message.channel.send({embed:helpEmbed});

		} else {
			const command = publicCommands.filter(command => command.name == args[0]);
			
			if(command.size){

				const helpEmbed = {
					title: command.get(args[0]).name,
					url: docURL,
					description: command.get(args[0]).description,
					thumbnail: {
						url: iconURL,
					},
					fields: {
						
						name: command.get(args[0]).name,
						value: command.get(args[0]).detailed
					},
					timestamp: new Date(),
					footer: {
						text: 'Now go out there and get me some golden eggs!',
						icon_url: iconURL,
					},
					
				};

			message.channel.send({embed:helpEmbed});

			} else message.channel.send("Invalid command.");

		}
	},
};