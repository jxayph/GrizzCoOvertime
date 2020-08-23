/*
teams should be balanced; so no 4 4 4 1, do 4 3 3 3.
teams should be spread. so, provisions for not matching the same players up again and again

goal is 4 rounds with no team members ever playing twice


*/
//var PLAYER_LIST = ['A','B','C','D','E','F','G','H','1','2','3','4','5','6','7','8'];
var PLAYER_LIST;
var MASTER_LIST = ['A','B','C','D','E','F','G','H','1','2','3','4','5','6','7','8'];
//var MASTER_LIST = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','1','2','3','4','5','6','7','8'];
var players;
var numTeams = 0;
var teams = [];
var lowestCollisions = Number.POSITIVE_INFINITY;

var thisSeed = [];
var bestSeed = [];




class Player{
	constructor(name){ //need id and FC
		this.id = "default";
		this.fc = "default";
		this.name = name;
		this.pastTeams= [];
		this.score = 0;
		this.ready = false;
	}
}

function init(){	
	
	PLAYER_LIST = MASTER_LIST.slice();
	
	numTeams = Math.ceil(PLAYER_LIST.length/4);
		
	for( var i = 0; i < 4*numTeams; i++){
		if(i < PLAYER_LIST.length)
			PLAYER_LIST[i] = new Player(PLAYER_LIST[i]); // Add all players as objects.
	}
	players = PLAYER_LIST.slice();
		
	for (var i=0; i < numTeams; i++){ // Initialize teams as an empty list.
		teams.push([]);
	}
	
}

function matchMake(prevLow){
	var i = 0;
	var bestTeams = [];
	var lowestCount = 9999;
	
	while(i < 99999){
		var results = makeTeams(); // Generate a random team.
		if(results.count < lowestCount){ // If the collision count of this team is lower, save it in.
			bestTeams = results.teams;
			lowestCount = results.count;
		}
		
		players = PLAYER_LIST.slice(); // Refresh the player list and iterate		
		i++;
		
		if (lowestCount == prevLow){ // We're never going to go down in collisions, so if we don't add any new ones that's good enough to quit.
			console.log("Stopped at " + i);
			i = Number.POSITIVE_INFINITY;
		}
	}
	console.log("LOWEST COUNT WAS " + lowestCount + '\n' + '\n');
	
	teams = bestTeams;
	return lowestCount;
	//return {count: lowestCount,
	//		teams: bestTeams};
}

function makeTeams(){
	var trialTeams=[];

	for (var i=0; i<numTeams; i++){ // Initialize teams as an empty list.
			trialTeams.push([]);
	}

	var collisionCount = 0;
	
	for(var p = 0; p < 4; p++){//4 players in each team
		for (var t = 0; t < numTeams; t++){ //for every team
			//make a team
			trialTeams[t].push(selectPlayer()); // pull a selection from the pool for the trial.
		}
	}
	
	
	for (var t = 0; t < numTeams; t++){
		for( var p = 0; p < 4; p++){
			if(trialTeams[t][p]!= undefined){
				collisionCount += checkCollisions(trialTeams[t], trialTeams[t][p]);
			}	
		}
	}
	return {
		teams: trialTeams,
		count: collisionCount
	}
	
}
/*
trialTeam is a 4 long array of Player objects. player is a Player object. Player is guaranteed to never be a random.
*/
function checkCollisions(trialTeam, player){
	var past = player.pastTeams;
	var teammate;
	var count = 0;
	
	for (var p = 0; p < trialTeam.length; p++){	// for every player in the team
		teammate = trialTeam[p];		
		if (teammate == undefined){// if we're looking at a random player in this proposed team
			for (var i = 0; i < past.length; i++){ //check the player's history for ANY randoms.
				for (var j = 0; j < 4;j++){
					if (past[i][j] == undefined){
						count++;
					}
				}
			}
		}else if (teammate.name != player.name){ // if we're looking at a competing player, skip comparisons to own self
			// count how many times the teammate shows up in player's history
			for (var i = 0; i < past.length; i++){
				for (var j = 0; j < 4;j++){
					if ((past[i][j]!= undefined) && (past[i][j].name == teammate.name)) count++;
					}
				}
			}
				
	}
	
	//console.log(count);
	return count;
}


function rIdx(n){
	return rInt(0,n);
}

function rInt(a,b){
	var r = a+ Math.floor(Math.random() * b);
	return r;
}


function selectPlayer(){
	return players.splice(rIdx(players.length),1).pop(); // grab a random player uwu
}

function printTeams(){
	var team = "";
	for (var t = 0; t < numTeams; t++){
		for( var p = 0; p < 4; p++){
			if(teams[t][p]!= undefined)
				team += teams[t][p].name + ", ";
			else team+= ("Random Player, ");
		}
		console.log(team);
		team = "";
	}
}

function printOutput(){
	for (var t = 0; t < bestSeed.length; t++){
		var team = "";
		for (var p = 0; p < 4; p++){
			if(bestSeed[t][p]!= undefined){
				team+= bestSeed[t][p].name + ", ";
			} else team+= ("Random Player, ");
			
		}
		console.log(team);
	}	
}

function endRound(){
	players = PLAYER_LIST.slice(); // Refresh the player list.
	
	// Add each team to the past teams of each player
		
	for (var t = 0; t < numTeams; t++){
		thisSeed.push(teams[t]);
		for( var p = 0; p < 4; p++){
			if(teams[t][p]!= undefined){
				teams[t][p].pastTeams.push(teams[t]);
			}
		}
	}
}

function playRound(prevLow){
	var newLow = matchMake(prevLow);
	endRound();
	printTeams();
	return newLow
}

function seedTourney(numRounds){
	init(); // Reset variables for the new seed
	
	var prevLow = 0; // The lowest count of collisions in a given tournament seed.
	
	for (var i = 0; i < numRounds; i++){ // Run as many rounds as requested
		prevLow = playRound(prevLow); // Save in the new collision count
	}
	
	if (prevLow < lowestCollisions){ // If this seed's teams have less collisions than the last seed, save this seed's teams.
		teamHistory=[];
		//Add the teams from this seed to the team history.
		bestSeed = thisSeed.slice();
		lowestCollisions = prevLow;
	}
	thisSeed = [];//Reset the container
}

function runTourney(numRounds, numSeeds){
	
	for(var i = 0; i < numSeeds; i++){
		console.log('\n'+"Seed number " + i + '\n')
		seedTourney(numRounds);
		if(lowestCollisions == 0) i = Number.POSITIVE_INFINITY;// Break out if the perfect seed is found
	}
	
	console.log("Best seed was found with " + lowestCollisions + " collisions."+'\n');
	printOutput();
	
}




//runTourney(8,1);





/* 

A B C D E F G H 1 2 3 4 5 6 7 8
ABCDEFGH12345678

245E GDAB 3HFC 7618
28AF B135 HED6 7G4C
21CD 3AE7 64FB H8G5 
236G 4A1H 8BCE 75DF

 */


