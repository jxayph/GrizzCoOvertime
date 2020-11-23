module.exports = {
	name: 'submit',
    description: 'Submit scores.',
    detailed: 'Syntax: !submit <score> <team> <dcs>, where dcs are the numbers in [1,4] corresponding to members that DC\'d.',
    admin: true,
    execute(message, args, globals){

        // Return errors if not the right time to be submitting scores.
        if(globals.tourneyPhase == false){ 
            return message.channel.send("There is no active tournament.");
        }
        if(globals.currentRound == -1){
            return message.channel.send("Please start the first round!")
        }

        // Argument parsing
        let score, team;
        let dcs = [];

        if (args[0]) score = args[0];
        else return;

        if (args[1]) team = (args[1] - 1);
        else return;
        
        for(let i = 2; i < args.length; i++){
            if (checkDisconnectArg(args[i])) dcs.push(args[i] - 1);
            else message.channel.send("Rejecting disconnect argument, not a number from 1 to 4.");
        }

        if((args[1] > globals.teamCount) || args[1] == 0 ) return message.channel.send(`[${args[1]} is not a valid team number!`);
        
        // Committing score after validating input arguments
        commmitScore(team, globals, score, dcs);
        globals.submitted[team] = true;

        message.channel.send(`Submitted a score of ${score} for Team ${(team + 1)}.`);
        if(dcs.length > 0) message.channel.send(`Team member(s) at index(es) ${dcs} disconnected.`);
    }
}

function checkDisconnectArg(playerTeamIdx){
    const regex = new RegExp(/([1-4])/);
    //console.log(playerTeamIdx +" "+ (playerTeamIdx.length == 1 && regex.test(playerTeamIdx)) );
    return (playerTeamIdx.length == 1 && regex.test(playerTeamIdx) );
    
}

function commmitScore(team, globals, score, dcs){
    let currentRound = globals.currentRound; // Round was advanced in next, so we have to do a local conversion.
    let startIdx = 4*((currentRound*globals.teamCount) + team);
    let teamMembers = globals.seed.slice(startIdx, startIdx + 4);

    const hadDisconnect = (dcs.length != 0);
    const hadRandom = teamMembers[3] == 'R';

    for (let i = 0; i < teamMembers.length; i++){
        if (teamMembers[i] != 'R'){
            let player = globals.players[teamMembers[i]];
            player.scores[currentRound] = score;
            player.randoms[currentRound] = hadRandom;

            if(hadDisconnect){
                if ( !dcs.includes(i) ) player.teamDC[currentRound] = true;
                else player.teamDC[currentRound] = false;
            } else player.teamDC[currentRound] = false;
        } 
    }
}
