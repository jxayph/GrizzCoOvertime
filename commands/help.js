module.exports = {
	name: 'help',
	description: 'Provides a list of available commands. Use !help <command> for more details.',
	detailed: 'If you are still confused after reading through the detailed help, please feel free to ping a tournament organizer for further assistance.',
	admin: false,
	execute(message, args, globals) {
		const publicCommands = globals.client.commands.filter(command => command.admin == false);
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
				fields: commandInfo
			}
			message.channel.send({embed:helpEmbed});
		} else {
			const command = publicCommands.filter(command => command.name == args[0]);
			
			if(command.size){
				
				const helpEmbed = {
					title: command.get(args[0]).name,
					fields: {
						name: command.get(args[0]).description,
						value: command.get(args[0]).detailed
					}
				}
			message.channel.send({embed:helpEmbed});
			} else message.channel.send("Invalid command.");

		}
	},
};