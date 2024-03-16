const Lotto = require('../../helpers/Lotto.js');
const saveLottoData = require('../../helpers/saveLottoData.js').saveLottoData;
const shuffle = require('../../helpers/shuffle.js').shuffle;
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		const teamCount = parseInt(args[0]);
		// Return all chats to extra category
		const squadChatCategoryID = globals.client.tourneyGuild.channels.cache.filter(ch => ch.type === 'GUILD_CATEGORY' && ch.name === 'Squad Chat').first().id;
		const extraSquadChatCategoryID = globals.client.tourneyGuild.channels.cache.filter(ch => ch.type === 'GUILD_CATEGORY' && ch.name === 'Extra Squad Chats').first().id;
		const squadChats = globals.client.tourneyGuild.channels.cache.filter(ch => ch.parentId === squadChatCategoryID);

		squadChats.forEach(squad => {
			squad.setParent(extraSquadChatCategoryID, { lockPermissions: false });
		});

		// Put n chats into the Squad Chat category
		for (let i = 1; i < teamCount + 1; i++) {
			globals.client.tourneyGuild.channels.cache.find(ch => ch.name == `Squad ${i} Voice`).setParent(squadChatCategoryID, { lockPermissions: false });
			globals.client.tourneyGuild.channels.cache.find(ch => ch.name == `squad-${i}-text`).setParent(squadChatCategoryID, { lockPermissions: false });
		}
		return;
	},
};