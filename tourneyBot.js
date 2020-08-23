var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// This is stuff I copypasted because I don't know how to code
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

// Bot startup
bot.on('ready', function (evt) {
    console.log('\nConnected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
	
	loadSavedUsers(); // Load in saved users
});

// Disconnect event listener
bot.on('disconnect', function (err, errCode) {
	console.log('Disconnected.')
	
	setTimeout(function (){
		bot.connect();
		console.log('Reconnecting...');
	}, 3000);
});

// Filesystem stuff. Require certain information for startup.
const fs = require("fs");
bot.savedUsers = require('./savedUsers.json'); // List of users
bot.botChannels = require('./botChannels.json'); // List of channels the bot can work in
bot.roles = require('./roles.json'); // List of the roles the bot can assign
//bot.roles = require('.errorCodes.json'); // List of the error codes and help messages.


// Tournament variables
var tourneySeed = ""; // Matchmaking seed for the tournament. e.g., F5GEH241DA7B36C*A3156BEHCF47DG2*7G615BC23DHF4AE*DC1E4B3GA2F675H* ( 4 rounds with 15 players)
var scores = {}; // scores[userCode] - Container mapping alphabetical userCode to an array of strings detailing their scores ('*' means disconnect handicap)
var users = {}; // Define an object of users for later use.
var readyUsers = {}; // readyUsers[userCode] - Container mapping alphabetical code to user objects
var submittedTeams = [];
var numReady = 0;
var numTeams;
var teams = {}; //teams[teamID] - Container mapping teamID to an a string of 4 userCodes
var roundCount = 0;

var readyOK = false; // To be used with checkready

bot.on('message', function (user, userID, channelID, message, evt) {
	if(evt.d.author.bot) return;
	console.log("-------------------");
	
	if(users[userID] == undefined){ // Register every user that sends a message.
		users[userID] = evt.d.author;
		users[userID].admin = false;		
		users[userID].registered = false;
		users[userID].ready = false;
		users[userID].IGN = "";
	}
		
    // Listening for command trigger '!'
    if (message.substring(0, 1) == '!' && (isBotChannel(channelID)||users[userID].admin)) { // Only allow commands in whitelisted bot commands channels. Admin users can bypass this.
		// case insensitivity support. Arguments separated by whitespace.
        var args = message.toLowerCase().substring(1).split(' ');
		console.log(args);
        var cmd = args[0];
		
		// Remove excessive whitespace
		for(var i = 0; i < args.length; i++){
			if(args[i] == ' ' || args[i] == ''){
				args.splice(i,1);
				i--;
			}
		}
		
        args = args.splice(1); // Remove the command from the arguments
		var serverID = bot.channels[channelID].guild_id;
        switch(cmd) {
			case 'reboot':
				if (!users[userID].admin) break; //admin only command
				bot.sendMessage({
                    to: channelID,
                    message: 'Rebooting.'
                });
				bot.disconnect();
				break;
            case 'ping':
			
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
				break;
				
			// case 'help':
				// var command = args[0]
				// bot.sendMessage({
					// to: channelID,
					// message: printHelp(command)
				// });
				// break;
				
			case 'register': // Takes FC and IGN			
				
				if(readyOK){// May not change registration status during the ready phase.
						bot.sendMessage({
						to: channelID,
						message: "You may not change your registration status during the ready phase."
					});
					break;
				}
			
				var FC = args[0];
				var IGN = args[1];
								
				bot.sendMessage({
					to: channelID,
					message: registerUser(serverID, FC, IGN, userID)
				});
				
				saveUsers();
				break;
				
			case 'ready': // Used by participants to confirm that they are ready to play in the tournament
				bot.sendMessage({
					to: channelID,
					message: toggleReady(userID, serverID, 0)
				});
				
				saveUsers();
				
				break;
				
			case 'save': // Admin command. Forces a save of users.
				if(!users[userID].admin)break;

				bot.sendMessage({
					to: channelID,
					message: 'Saving users.'
				})
				
				saveUsers();
							
				break;
				
			case 'checkready': // Command to ping registered users to check if they're ready to play
				if (!users[userID].admin) break; //admin only command
				readyOK = true;
				clearReady();
				
				bot.sendMessage({
					to: bot.botChannels['announcements'],
					message:  '<@&' + bot.roles['registered'] +
					'> \n**The tournament will begin shortly.** \nPlease use the `!ready` command to show that you are ready to participate!' +
					'\nPlease ignore this message if you no longer wish to participate.'
					}, function (error, response){
					console.log(error);
				 });
				 
				break;
				
			case 'setready': // Toggle the ready state to allow time to matchmaking without worrying about new users being added.
				if (!users[userID].admin) break; //admin only command
				readyOK = !readyOK;
				console.log("ReadyOK set to "+ readyOK);
				
				break;
			
			case 'matchmaking': // Begin the matchmaking phase. At this point, no new users may participate.
				if (!users[userID].admin) break; // Admin only command.
				
				readyOK = false;
				getReadyUsers();
				
				bot.sendMessage({
					to: channelID,
					message: numReady + ' ready users.'
				});
				
				bot.sendMessage({
					to: bot.botChannels['announcements'],
					message:  '<@&' + bot.roles['ready'] +'> \n**The tournament will begin very soon!**\n You will soon be granted access in your team channels.\n'
					}, function (error, response){
					console.log(error);
				 });
				
				break;
			
			case 'setseed': // Set the RNG seed for the tournament
				if (!users[userID].admin) break; //admin only command
				readSeed();
				bot.sendMessage({
					to: channelID,
					message: 'Seed is set!'
				});
				
				break;
				
			case 'start': // Advance the game by one round.
				if (!users[userID].admin) break; //admin only command
				playRound(serverID);
				
				bot.sendMessage({
					to: channelID,
					message: 'Advancing rounds.'
				});
				
				break;
			
			case 'getteams': // Get the members of a team. Admin debug command.
				if(!users[userID].admin) break;
				bot.sendMessage({
					to: channelID,
					message: printTeams()
				});
				
				break;			
			
			case 'endround':
			case 'next': // Needs to be a provision to ensure that all team scores have been submitted before advancing
				if(!users[userID].admin) break;
				
				if (submittedTeams.length < numTeams){
					
					bot.sendMessage({
						to: channelID,
						message: 'Not all submissions are in. Submitted teams are ' + submittedTeams
					});
					
					break;
				}
				
				removeTeamRoles(serverID); // Remove team roles before assigning new ones		
				
				playRound(serverID);
				
				bot.sendMessage({
					to: channelID,
					message: 'Advancing rounds.'
				});
				bot.sendMessage({
					to: bot.botChannels['announcements'],
					message: '',
					embed: scoreEmbed()
				});

				break;
			
			case 'submit': // Function for score submission.
				var err = '';
				
				if (!users[userID].admin) break; //admin only command
				
				if(args[0] == undefined) err = 'No score argument';
				if(args[1] == undefined) err = 'no team argument';
				
				if(err != '') {
					console.log(err);
					break;
				}
				
				var score = args[0];
				var team = teams[args[1].toUpperCase()]; // team codes are uppercase

				submitScore(team, score, args[1].toUpperCase());
				bot.sendMessage({
				to: channelID,
				message: 'Submitted a score of ' + score + ' for team ' + args[1].toUpperCase()
			});
							
				break;
				
			case 'scores':
				bot.sendMessage({
					to: channelID,
					message: '',
					embed: scoreEmbed()
				});
				
				break;
				
			case 'reset': // Function to reset roles at the end of a tourney.
				if (!users[userID].admin) break; //admin only command
				
				resetAllRoles(serverID);
					bot.sendMessage({
					to: channelID,
					message: 'Resetting tournament roles.'
				});
				
				break;
			default:
			bot.sendMessage({
				to: channelID,
				message: 'Unrecognized command.'
			});
         }
     }
});

function resetAllRoles(serverID){
	var userIDs = Object.keys(users); // Array of the IDs of all registered users

	var timeOutIdx = 0;
	
	for (var i = 0; i < userIDs.length; i++){ // Go through and remove tournament roles from all users
		var player = users[userIDs[i]];
		timeOutIdx = resetPlayerRoles(player, serverID, timeOutIdx);	
		player.registered = false;
		player.ready = false;
		timeOutIdx++;
	}
	
	saveUsers();
}

function resetPlayerRoles(user, serverID, timeOutIdx){
	var userID = user.id;
	var userRoles = 
		Object.values(bot.servers[serverID].members)
		.filter(member => member.id == userID)[0].roles;
		
	if (userRoles.includes(bot.roles['registered'])){
		removeRole(serverID, userID, bot.roles['registered'], timeOutIdx);
		timeOutIdx++;
	}
		
	if (userRoles.includes(bot.roles['ready'])){
		removeRole(serverID, userID, bot.roles['ready'], timeOutIdx);
		timeOutIdx++
	}
	
	
	for (var i = 0; i < 8; i++){
		if (userRoles.includes(bot.roles[charIdx(i)])){
			removeRole(serverID, userID, bot.roles[charIdx(i)], timeOutIdx);
			timeOutIdx++;
		}
	}
	return timeOutIdx;
}

function submitScore(team, score, teamChar){ // uses global roundCount

	if (!submittedTeams.includes(team)) submittedTeams.push(teamChar);
	
	for (var i = 0; i < 4; i++){
		
		var playerChar = team[i];
		
		if (playerChar != '*'){ // don't add score for randoms
			
			if (scores[playerChar] == undefined){ // Initialize the array of scores on the first round.
				scores[playerChar]=[score];
			}
			else{				
				scores[playerChar][roundCount - 1] = score; // Assign the score for the round.	
				
				console.log('Player ' + playerChar + ':');
				console.log(scores[playerChar]);
			}
		}
		
	}
		
}

function scoreEmbed(){
	var embed = {
		color: 3447003,
		title: 'Current Standings',
		description:'Round '+ (roundCount -1),
		fields: getScores()
	}
	return embed;
}


function getScores(){ // Sum up each player's scores and output them as an embed.
	
	var scoreInfo = [];
	
	for (var i = 0; i < numReady; i++){ // go through every participating player
		
		var playerCode = charIdx(i); // Get the alphabetical code assigned to this tournament player.
		var playerScores = scores[playerCode] // Get the string of their scores
		
		if (playerScores == undefined){
			scoreInfo.push({
				name: readyUsers[playerCode].IGN,
				value: '0 points' + '\n' + mention(readyUsers[playerCode])
			})
		} else {			
			var totalScore = 0 + addScores(playerScores); // The sum of an individual player's scores
			scoreInfo.push({ // Values for fields in an embed
					name: readyUsers[playerCode].IGN,
					value: totalScore + ' points' + '\n' + mention(readyUsers[playerCode])
				});	
		}			
	}
	
	scoreInfo.sort( function (a, b){
				return (getScoreFromString(b.value) - getScoreFromString(a.value))
		});
	
	return scoreInfo;
	
}



function addScores(normalScores){
	
	if (normalScores == [] || normalScores.length == 0) return 0;
	
	var playerScore = 0;
	
	for (var i = 0; i < normalScores.length; i++){
		playerScore += parseInt(normalScores[i]);
	}
	
	return playerScore;
	
}

function getScoreFromString(str){ // Get the score of a player by reading the first few numerical characters of a string.
	
	if(str.length == 0) return 0
	
	var scoreString = "";
	for (var i = 0; i < str.length; i++){
		if (isNumber(str[i])) scoreString += str[i];
		else i = Number.POSITIVE_INFINITY;
	}
	return parseInt(scoreString);
}

function teamEmbed(teamID){
	var members = teams[teamID]; // Get the 4-long string of memberIDs
	
	var squadInfo = []; // Put members into the squad info for fields argument
	
	for( var i = 0; i < 4; i++){
		if( members[i] == '*'){ // If we have a random player
			squadInfo.push({
				name: 'Freelancer',
				value:'N/A'
			});
		}
		
		else{
			var s = readyUsers[members[i]].FC
			
			squadInfo.push({
				name: readyUsers[members[i]].IGN,
				value: s.slice(0,4) + '-' + s.slice(4,8) + '-' + s.slice(8)+'\n'+ mention(readyUsers[members[i]])
			})
		}
	}	
	
	var embed = {
		color: 3447003,
		title: 'Squad '+ teamID,
		description:'Meet your squad!',
		fields:squadInfo
	}
	return embed;
}


function printTeams(){
	var teamsString ="";
	for (var i = 0; i < numTeams; i++){
		teamsString += ("Team " + charIdx(i) + ':`' + teams[charIdx(i)] + '`\n');
	}
	console.log(teamsString);
	return teamsString;
}

function readSeed(){ // Load in the seed from the seed file
	tourneySeed = fs.readFileSync("./mmSeed.txt",'utf8', err => {
		if(err) throw err;
	});
	console.log(tourneySeed);
}

function playRound(serverID){
	matchMaking(); // Run the matchmaking function
	assignTeamRoles(serverID);
	setTimeout(function() {
			sendTeamEmbed()
		}
		, 1500 * numReady);	
}

function assignTeamRoles(serverID){
	
	var timeOutIdx = 0;
	
	for (var i = 0; i < numTeams; i++){
		
		var teamString = teams[charIdx(i)]; // Get the 4-long string of team members
		
		for (var j = 0; j < 4; j++){
			
			var playerCode = teamString[j];
			
			if (playerCode != '*'){ // If they're not a random, we must give them a role
				
				var player = readyUsers[playerCode]; // Get the user object				
				var roleID = bot.roles[charIdx(i)]; // Get the team role's discord ID
				addRole(serverID, player.id, roleID, timeOutIdx);
				timeOutIdx++;
			}
		}	
	}
}

function removeTeamRoles(serverID){
	
	var timeOutIdx = 0;
	
	for (var i = 0; i < numTeams; i++){
		
		var teamString = teams[charIdx(i)]; // Get the 4-long string of team members
		
		for (var j = 0; j < 4; j++){
			
			var playerCode = teamString[j];
			
			if (playerCode != '*'){ // If they're not a random, remove the role
				
				var player = readyUsers[playerCode]; // Get the user object				
				var roleID = bot.roles[charIdx(i)]; // Get the team role's discord ID
				removeRole(serverID, player.id, roleID, timeOutIdx);	
				timeOutIdx++;
			}
		}	
	}
}

function getReadyUsers(){
	readyUsers = {};
	
	numReady = 0; // Reset to zero
	
	var userIDs = Object.keys(users); // Array of the IDs of all registered users
	
	for (var i = 0; i < userIDs.length; i++){ // Go through and separate ready users
		if(users[userIDs[i]].ready){
			readyUsers[charIdx(numReady)] = users[userIDs[i]]; // Map user objects to alphabetical characters		
			numReady++;
		}
	}
}



function matchMaking(){
	console.log("Round " + (roundCount+1));		
	makeSquads();
	roundCount++;
}

function makeSquads(){
	teams  = {}; // Reset the team container
	numTeams = Math.ceil(numReady/4);
	
	console.log(numTeams + " Teams, Using seed: " + tourneySeed);
	
	if(numTeams < 2){ // Minimum number of teams is 2
		numTeams = 2;
		}
	
	for (var i = 0; i < numTeams; i++){ // Construct the team objects, mapping 4 characters to each teamCode
		teams[charIdx(i)] = tourneySeed.slice(4*i, 4 + 4*i);
	}
	
	tourneySeed = tourneySeed.substr(4*numTeams); // Remove the used values of tourneySeed.	
	
	if(tourneySeed.length==0){ // Recycle the seed if we exhaust it
		readSeed();
	}
}

function charIdx(n){ // Returns a character <i> indexes along from 'A'
	return String.fromCharCode('A'.charCodeAt(0)+ n);
}

function mention(user){
	return '<@' + user.id + '>';
}

function teamEmbed(teamID){
	var members = teams[teamID]; // Get the 4-long string of memberIDs
	
	var squadInfo = []; // Put members into the squad info for fields argument
	
	for( var i = 0; i < 4; i++){
		if( members[i] == '*'){ // If we have a random player
			squadInfo.push({
				name: 'Freelancer',
				value:'N/A'
			});
		}
		
		else{
			var s = readyUsers[members[i]].FC
			
			squadInfo.push({
				name: readyUsers[members[i]].IGN,
				value: s.slice(0,4) + '-' + s.slice(4,8) + '-' + s.slice(8)+'\n'+ mention(readyUsers[members[i]])
			})
		}
	}	
	
	var embed = {
		color: 3447003,
		title: 'Squad '+ teamID,
		description:'Meet your squad!',
		fields:squadInfo
	}
	return embed;
}



function clearReady(){
	console.log("Clearing user ready flags");
	var userIDs = Object.keys(users);
	for (var i = 0; i < userIDs.length ;i++){
		users[userIDs[i]].ready=false;
	}
	saveUsers();
}

function saveUsers(){
	bot.savedUsers = users
	fs.writeFile("./savedUsers.json", JSON.stringify(bot.savedUsers, null, 4), err => {
		if(err) throw err;
	});
}

function registerUser(serverID, FC, IGN, userID){

	if (users[userID].registered && FC == undefined && IGN == undefined){
		users[userID].registered=false;
		removeRole(serverID, userID, bot.roles["registered"], 0);
		return ("Successfully unregistered. Hope to see you in the next one!");
		
	}
	
	var verify = verifyFC(FC);
	if(!verify[0]){
		return verify[1]; // Return, printing an error if format is wrong.
	}
	
	if(IGN == undefined){
		return ("Please input your IGN as the second argument.");
	}
	
	IGN = IGN.substring(0,10);	
	
	users[userID].IGN = IGN;
	users[userID].FC = FC;
	users[userID].registered = true;
	console.log(FC + " " + IGN);
	addRole(serverID, userID, bot.roles["registered"], 0);
	
	return ("Successfully registered player " + IGN + " for the coming tournament. Good luck, and have fun!");
}

function loadSavedUsers(){
	console.log("Loading saved users...");
	users = bot.savedUsers;
	console.log("Loaded!");
}

function verifyFC(FC){
	if(FC == undefined){
		var msg = 'Please enter a 12-digit number as your friend code.'
		return([false,msg]);
	}
	if(FC.length != 12){
		var msg = 'Please enter a 12-digit number as your friend code.'
		return( [false, msg]);
	}
	for(var i = 0; i < FC.length; i++){
		if(!isNumber(FC[i])){
			var msg = 'Invalid character detected. Please only enter numbers in your friend code.'
			return ([false, msg]);
		}
	}
	return ([true,'']);
}

function isNumber(num){
	return (num.charCodeAt(0) > 47 && num.charCodeAt(0) < 58);
}

function makeNum(string){
	var output = "";
	for(var i = 0; i < string.length; i++){
		if((string[i].charCodeAt(0) > 47 && string[i].charCodeAt(0) < 58))
			output += string[i];
	}
	return output;
}


function Embed(title_, description_, footer_){
		this.color = 3447003;
		this.title = title_;
		this.description = description_;
		this.fields = [];
		this.footer = footer_
		this.timestamp = new Date();
		
		this.addField = function (name, value){
			var field = {name, value};
			this.fields.push(field);
		}
}

function isBotChannel(channelID){ // Whitelist of public bot channels.
	return bot.botChannels.whitelist.includes(channelID.toString(10)); // I have to use toString because it doesn't like big numbers
}

function getFC(userID){
	if(users[userID].FC == undefined)
		return 'No friend code registered.';
	
	var rawFC = users[userID].FC;
	var FC = 'SW-';
	
	FC += rawFC.slice(0,4) + '-' + rawFC.slice(4, 8) + '-' + rawFC.slice(8);
	return FC;
}

// function toggleRole(serverID, userID, roleID){
	// var userRoles = 
		// Object.values(bot.servers[serverID].members)
		// .filter(member => member.id == userID)[0].roles;
		
	// if (userRoles.includes(roleID.toString(10))) removeRole(serverID, userID, roleID, timeOutIdx);
	// else addRole(serverID, userID, roleID, timeOutIdx);
// }

function addRole(serverID, userID, roleID, timeOutIdx){
	setTimeout(function() {
			bot.addToRole(
				{
					serverID:serverID,
					userID:userID,
					roleID:roleID
				},
				function(err,response) {
					if (err) console.error(err);                   
				});
			}
		, 1500 * timeOutIdx);	
}	

function toggleReady(userID, serverID, timeOutIdx){
	if(!readyOK){
		return ("You may not ready up at this time.");
	}
	
	if(users[userID].ready) {
		//Toggle ready off
		users[userID].ready = false;
		removeRole(serverID, userID, bot.roles['ready'], timeOutIdx);
		return ("Player " + users[userID].IGN + " is **NOT** ready!");
	}else{
		//Toggle ready on
		users[userID].ready = true;
		addRole(serverID, userID, bot.roles['ready'], timeOutIdx);
		return("Player " + users[userID].IGN + " is ready!");
		
	}
}

function removeRole(serverID, userID, roleID, timeOutIdx){
	setTimeout(function() {
			bot.removeFromRole(
			{
				serverID:serverID,
				userID:userID,
				roleID:roleID
			},
			function(err,response) {
				if (err) console.error(err);                   
			});
		}, 1500 * timeOutIdx);
	
}

function sendTeamEmbed(){
	for (var i = 0; i < numTeams; i++){
		var chr = charIdx(i)
	
		bot.sendMessage({
			//to: "736020097554186292",
			to: bot.botChannels[chr],
			message:mentionTeam(chr),
			embed:teamEmbed(chr)
		});
	}
}

function mentionTeam(chr){
	
	var teamString = teams[chr]
	var mentionString = '';
	for (var i = 0; i < 4; i++){
		var playerChar = teamString[i]
		if (playerChar != '*'){
			mentionString += (mention(readyUsers[playerChar])+ '\n');
			console.log(playerChar);
		}
	}
	return mentionString;
}

String.prototype.stringReplace = function(index, replacement){
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}