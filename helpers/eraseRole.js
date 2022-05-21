module.exports = {

	async eraseRole(message, roleName) {
		const memberList = message.guild.roles.cache.find(role => role.name == roleName).members.map(m => m.user.id);
		message.channel.send(`Removing role '${roleName}' from ${memberList.length} users...`);

		for (const member of memberList) {
			await message.guild.members.cache.get(member).roles.remove(message.guild.roles.cache.find(role => role.name == roleName));
		}
		return true;
	},
};