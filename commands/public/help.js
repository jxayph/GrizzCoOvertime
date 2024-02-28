const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Provides a list of available commands. Use !help <command> for more details.',
	detailed: 'If you are still confused after reading through the detailed help, please feel free to ping a tournament organizer for further assistance.',
	admin: false,
	execute(message, args, globals) {
		const publicCommands = globals.client.commands.filter(command => command.admin == false);
		const iconURL = 'https://media.discordapp.net/attachments/759237372578627624/759237412034445332/grzzpng.png';
		const docURL = 'https://tinyurl.com/GrizzCoOvertime';
		if (args.length == 0) {
			const commandInfo = [];

			for (const command of publicCommands.values()) {
				commandInfo.push({
					name: command.name,
					value: command.description,
				});
			}
			const numEmbeds = Math.floor(commandInfo.length / 25);
			for (let i = 0; i < numEmbeds + 1; i++) {
				const helpEmbed = new MessageEmbed()
					.setTitle('Command List')
					.setURL(docURL)
					.setDescription('For more details, please call !help <command>.')
					.setThumbnail(iconURL)
					.addFields(commandInfo.slice(i * 25, i * 25 + 25))
					.setTimestamp(new Date())
					.setFooter({
						text: 'Now go out there and get me some golden eggs!',
						icon_url: iconURL,
					});


				message.channel.send({ embeds: [helpEmbed] });
			}
		}
		else {
			const command = publicCommands.filter(thisCommand => thisCommand.name == args[0]);

			if (command.size) {

				const helpEmbed = new MessageEmbed()
					.setTitle(command.get(args[0]).name)
					.setURL(docURL)
					.setDescription(command.get(args[0]).description)
					.addFields({
						name: command.get(args[0]).name,
						value: command.get(args[0]).detailed,
					})
					.setThumbnail(iconURL)
					.setTimestamp(new Date())
					.setFooter({
						text: 'Now go out there and get me some golden eggs!',
						icon_url: iconURL,
					});

				message.channel.send({ embeds: [helpEmbed] });

			}
			else { message.channel.send('Invalid command.'); }

		}
	},
};