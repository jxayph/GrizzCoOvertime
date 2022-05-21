module.exports = {
	name: 'ready',
	description: 'Check in at the start of a tournament.',
	detailed: 'To toggle ready status, simply call !ready again.\n' +
		'Please be patient, as this command has a short cooldown of 1.5sec.',
	admin: false,
	execute(message, args, globals) {
		if (globals.readyPhase) {
			const userID = message.author.id;
			const userData = globals.client.userData[userID];
			const member = message.guild.members.cache.get(userID);

			if (userData && userData.registered) {
				if (userData.ready) {
					const text = `:x: Player ${userData.IGN} is **NOT** ready!`;
					const messageEmbed = {
						title: text,
					};
					message.channel.send({ embed: messageEmbed });

					member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Active Participant'));
					userData.ready = false;
					message.react('❌');
				}
				else {
					member.roles.add(message.guild.roles.cache.find(role => role.name === 'Active Participant'));
					userData.ready = true;


					if (member.roles.cache.some(role => role.name === 'Substitute')) { // If the user has registered as a sub, remove that.
						member.roles.remove(message.guild.roles.cache.find(role => role.name === 'Substitute'));
					}

					const text = `:white_check_mark: Player ${userData.IGN} is ready!`;
					const messageEmbed = {
						title: text,
					};
					message.channel.send({ embed: messageEmbed });
					message.react('✅');
				}
			}
			else {
				message.channel.send('You are not registered!');
			}

		}
		else {
			message.channel.send('You may not change your ready status at this point.');
		}
		return;
	},
};
