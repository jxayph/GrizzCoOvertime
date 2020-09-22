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
			return message.channel.send('Under construction!');
		}
	},
};