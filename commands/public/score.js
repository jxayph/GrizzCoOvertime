module.exports = {
	name: 'score',
	description: 'Check your tournament score.',
	detailed: 'May not be called unless there is a tournament actively running.',
	admin: false,
	execute(message, args, globals) {
		if(!globals.tourneyPhase){
			return message.channel.send('There is currently no active tournament.')
		}
		else{
			const authorID = message.author.id;
			Object.entries(globals.client.userData) // Filter out ready players
                            .filter(([userID, playerData]) => playerData.ready == true)


			return message.channel.send('Under construction!');
		}
	},
};