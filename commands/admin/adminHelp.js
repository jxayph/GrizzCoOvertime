const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'adminhelp',
	description: 'Provides a list of admin commands. Use !adminhelp <command> for more details.',
	detailed: 'If you\'re still confused, please ping JX or read the admin docs',
	admin: true,
	execute(message, args, globals) {
		const publicCommands = globals.client.commands.filter(command => command.admin == true);
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
					.setDescription('For more details, please call !adminhelp <command>.')
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
			const command = publicCommands.filter(fileCommand => fileCommand.name == args[0]);

			if (command.size) {
				const helpEmbed = new MessageEmbed()
					.setTitle(command.get(args[0]).name)
					.setURL(docURL)
					.setDescription(command.get(args[0]).description)
					.setThumbnail(iconURL)
					.addFields(
						{
							name: command.get(args[0]).name,
							value: command.get(args[0]).detailed,
						})
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