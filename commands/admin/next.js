const Player = require(`../../helpers/Player.js`);
const makeTeamEmbed = require(`../../helpers/makeTeamEmbed.js`).makeTeamEmbed;
const recycle = require(`../../helpers/recycle.js`).recycle;

module.exports = {
    name: 'next',
    description: 'Advance rounds.',
    detailed: 'Scores must be submitted prior to advancing. Submit a score of 0 for late teams.',
    admin: true,
    async execute(message, args, globals) {
        if (!globals.tourneyPhase) message.channel.send(`The tournament has not begun!`);

        // Ensure that scores are submitted before advancing rounds
        if (!checkAllSubmitted(message, globals)) return;

        // Increment the round counter
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

        // Send out team embeds
        for (let team = 0; team < teamCount; team++) {
            let startIdx = 4 * ((globals.currentRound * teamCount) + team);

            let teamMembers = seed.slice(startIdx, startIdx + 4);

            let players = [];
            for (let teamIdx = 0; teamIdx < 4; teamIdx++) {
                if (teamMembers[teamIdx] != `R`) players.push(globals.players[teamMembers[teamIdx]]);
            }

            if (globals.debug) message.channel.send(makeTeamEmbed(players, team, globals.currentRound));

            else { // sends squad messages to correct channels. also assigns the roles and stuff.
                await manageRoles(globals, message, players, team);
                const channelName = `squad-${(team + 1)}-text`;
                const squadChat = message.guild.channels.cache.find(channel => channel.name === channelName);
                squadChat.send(makeTeamEmbed(players, team, globals.currentRound));
            }
        }
    },
};

function checkAllSubmitted(message, globals) {
    const teamCount = globals.teamCount;
    let waiting = "";
    for (let i = 0; i < teamCount; i++) {
        if (!globals.submitted[i]) waiting = waiting.concat((i + 1) + ' ')
    }

    if (waiting.length != 0) {
        message.channel.send(`You may not advance rounds! Scores for team(s) ${waiting} have not yet been submitted!`);
        return false;
    }
    return true;

}

async function manageRoles(globals, message, players, teamIdx) {
    for (let i = 0; i < players.length; i++) {
        const guild = message.guild;
        const member = guild.members.cache.get(players[i].userID);
        const oldRoles = member.roles.cache.filter(role => role.name.startsWith(`Squad`)); // hacky fix, just detect and remove all squad roles. even the ghost roles.

        console.log(`Player ${players[i].IGN}`);

        if (oldRoles != undefined) oldRoles.forEach((value, key) => {
            member.roles.remove(value); // would like to make this async...
        });

        const newRole = guild.roles.cache.find(role => role.name === `Squad ${teamIdx + 1}`);

        await member.roles.add(newRole)


    }
}