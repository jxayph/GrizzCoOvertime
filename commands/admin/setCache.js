module.exports = {
	name: 'setcache',
	description: 'Set the guildMember cache.',
	detailed: 'Run this once at the start to set the cache.',
	admin: true,
	async execute(message, args, globals) {
		if (message.guild.memberCount == message.guild.members.cache.size) {
			await message.channel.send("Error: cache is already loaded.");
			return;
		}

		await message.guild.members.fetch()
			.then(message.channel.send("Cache loaded."));
		message.channel.send(
			`Membercount: ${message.guild.memberCount} \n` +
			`Cached member count ${message.guild.members.cache.size}`
		);
	},
};
