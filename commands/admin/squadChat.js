module.exports = {
	name: 'squadchat',
	description: 'Makes a bunch of squad chats',
	detailed: 'Don\'t run this command',
	admin: true,
	async execute(message, args, globals) {
		const DO_NOT_RUN = true;
		if(DO_NOT_RUN) return message.channel.send('Don\'t run this command.');

		const START_IDX = parseInt(args[0]);
		const NUM_SQUADS = parseInt(args[1]);
		for(let i = START_IDX; i < START_IDX + NUM_SQUADS; i++) {
			makeSquad(message, i);
		}

		return;
	},
};

async function makeSquad(message, squadNum) {
	// Role creation
	const roleData = {
		name: `Squad ${squadNum}`,
		hoist: false,
		mentionable: false,
	};

	const newRole = await message.guild.roles.create({ data: roleData })
		.catch(console.error);

	// Text channel creation
	const textPerms = [
		{
			id: newRole.id, // Squad role
			allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
		},
		{
			id: '733336588179734608', // ID for @everyone, guild ID
			deny: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
		},
	];
	const textOptions = {
		type: 'text',
		topic: `Squad ${squadNum} text chat.`,
		parent: '761755791409152020', // Squad channel category ID
		permissionOverwrites: textPerms,
	};

	message.guild.channels.create(`squad-${squadNum}-text`, textOptions)
		.catch(console.error);

	// Voice channel creation

	const voicePerms = [
		{
			id: newRole.id, // Squad role
			allow: ['VIEW_CHANNEL', 'STREAM', 'CONNECT', 'SPEAK', 'USE_VAD'],
		},
		{
			id: '733336588179734608', // ID for @everyone, guild ID
			deny: ['VIEW_CHANNEL'],
		},
	];
	const voiceOptions = {
		type: 'voice',
		parent: '761755791409152020', // Squad channel category ID
		permissionOverwrites: voicePerms,
	};

	message.guild.channels.create(`Squad ${squadNum} Voice`, voiceOptions)
		.catch(console.error);
}