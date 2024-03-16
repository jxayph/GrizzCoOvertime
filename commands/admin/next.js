const makeTeamEmbed = require('../../helpers/makeTeamEmbed.js').makeTeamEmbed;
const recycle = require('../../helpers/recycle.js').recycle;
const eraseRole = require('../../helpers/eraseRole.js').eraseRole;
const checkAllSubmitted = require('../../helpers/checkAllSubmitted.js').checkAllSubmitted;
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'next',
	description: 'Advance rounds.',
	detailed: 'Scores must be submitted prior to advancing. Submit a score of 0 for late teams.',
	admin: true,
	async execute(message, args, globals) {
		if (!globals.tourneyPhase) {
			await message.channel.send('The tournament has not begun!');
			return;
		}

		// Ensure that scores are submitted before advancing rounds
		if (!checkAllSubmitted(message, globals)) return;

		// Reset sub assignment flags
		for (let i = 0; i < globals.subQueue.length; i++) {
			globals.subQueue[i].assigned = false;
		}
		// Increment the round counter and reset submitted flags
		globals.currentRound++;
		for (let i = 0; i < globals.teamCount; i++) {
			globals.submitted[i] = false;
		}

		// Recycle seed at the end of its life.
		if (globals.seed[4 * ((globals.currentRound * globals.teamCount))] === undefined) {
			console.log(`End of seed at round ${globals.currentRound}. Recycling.`);
			recycle(globals);
		}

		// Unpacking globals for readability
		const seed = globals.seed;
		const teamCount = globals.teamCount;

		// Remove old roles EDIT: might be able to cut this now that squad roles are removed in submit
		await removeSquadRoles(message, teamCount);

		// Send out team embeds & log encounters for each player
		for (let team = 0; team < teamCount; team++) {
			const startIdx = 4 * ((globals.currentRound * teamCount) + team);

			const teamMembers = seed.slice(startIdx, startIdx + 4);

			const players = [];
			for (let teamIdx = 0; teamIdx < 4; teamIdx++) {
				// console.log('member ' + teamMembers[teamIdx] + 'at value ' + teamIdx);
				if (teamMembers[teamIdx] != 'R') players.push(globals.players[teamMembers[teamIdx]]); // Freelancer is represented by R
				else await assignSub(message, team, globals);
			}

			// Encounter logging
			for (let p = 0; p < players.length; p++) { // player index p
				for (let t = 0; t < players.length; t++) { // teammate index t
					if (p != t) {
						if (!players[p].encounters[players[t].userID]) { // if t's UID doesn't exist in encounter list
							players[p].encounters[players[t].userID] = 1; // set t's encounter to 1
						}
						else {
							players[p].encounters[players[t].userID]++; // if it already exists, increment
						}
					}
				}
			}

			if (globals.debug) { message.channel.send(makeTeamEmbed(players, team, globals.currentRound)); }

			else { // sends squad messages to correct channels. also assigns the roles and stuff.
				console.log(`Round ${globals.currentRound}:`);
				await manageRoles(globals, message, players, team);
				const channelName = `squad-${team + 1}-text`;
				const squadChat = message.guild.channels.cache.find(channel => channel.name === channelName);
				if (args[0] != '-v') {
					await squadChat.send(makeTeamEmbed(players, team, globals.currentRound))
						.then(pingSub(team + 1, squadChat, globals)) // Ping the sub in the squad chat to let them know they've been assigned
						.then(squadChat.send(`Please have your submission in before <t:${Date.parse(new Date()) / 1000 + 900}:t>`));
				}
			}
		}

		const announcementChannel = globals.client.channels.cache.find(channel => channel.name === 'tournament-announcements');
		if (args[0] != '-v') {
			return announcementChannel.send(
				'<@&736689720247058442>\n' +
				'We have moved on to the next round! Please check your squad chats to meet your new teams.');
			// + '<@&934542087431524403>, please contact an Organizer if you wish to fill in for a freelancer.');
		}
	},
};

async function manageRoles(globals, message, players, teamIdx) {

	const guild = message.guild;
	for (let i = 0; i < players.length; i++) {

		if (players[i] != undefined) { // hack shit fix
			const member = await guild.members.fetch(players[i].userID);

			const newRole = guild.roles.cache.find(role => role.name === `Squad ${teamIdx + 1}`);

			if (member != undefined) {
				await member.roles.add(newRole)
					.then(console.log(`Assigning role Squad ${teamIdx + 1} to player ${players[i].IGN}`));
			}
		}
	}
	console.log('Role assigment finished.\n');
}

async function removeSquadRoles(message, teamCount) {
	for (let i = 0; i < teamCount; i++) {

		await eraseRole(message, `Squad ${i + 1}`);
	}
}

async function assignSub(message, team, globals) {
	if (globals.subQueue.length > 0 && !globals.subQueue[0].assigned) { // If we have registered subs and the first sub in the queue is unassigned, add that sub to the squad.

		const sub = globals.subQueue[0];

		const guild = message.guild;
		const member = await guild.members.fetch(sub.userID);
		const newRole = guild.roles.cache.find(role => role.name === `Squad ${team + 1}`);
		if (member != undefined) {
			await member.roles.add(newRole)
				.then(console.log(`Assigning role Squad ${team + 1} to substitute ID ${sub.userID}`));
		}

		sub.assigned = true;
		sub.squad = team + 1;

		globals.subQueue.push(globals.subQueue.splice(0, 1)[0]); // Move this assigned player to the back of the queue
	}
	return;
}

async function pingSub(team, squadChat, globals) {
	let index = -1;
	for (let i = 0; (index == -1) && (i < globals.subQueue.length); i++) {
		if (globals.subQueue[i].assigned && globals.subQueue[i].squad == team) index = i;
	}

	if (index != -1) {
		const sub = globals.subQueue[index];
		squadChat.send(sub.getMention() + `, you have been assigned to substitute in squad ${team}!`);
	}


}