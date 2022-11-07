const { MessageEmbed } = require('discord.js');

module.exports = {
	makeTeamEmbed(teamMembers, teamNum, currentRound) {
		const iconURL = 'https://cdn.discordapp.com/avatars/518861328526606347/b2774300463506104c08ee2d878f7459.png?size=128';

		const deadline = new Date(Date.parse(new Date()) + 900000); // add 15min in ms

		const teamEmbed = new MessageEmbed()
			.setTitle(`[Squad ${(teamNum + 1)}] Round ${(currentRound + 1)}`)
			.setDescription('Meet your squad!')
			.setThumbnail(iconURL)
			.setTimestamp(new Date())
			.setFooter({
				text: 'Now go out there and get me some golden eggs!',
				icon_url: iconURL,
			});

		for (let i = 0; i < 4; i++) {
			if (teamMembers[i] == undefined) {
				teamEmbed.addFields({
					name: 'Freelancer',
					value: 'N/A',
				});
			}
			else {
				teamEmbed.addFields({
					name: teamMembers[i].IGN,
					value: teamMembers[i].FC,
				});
			}
		}

		return ({ embeds: [teamEmbed] });
	},
};