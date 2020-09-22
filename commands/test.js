module.exports = {
	name: 'test',
    description: 'whatever',
    detailed: 'admin test shit',
	admin: true,
	execute(message, args, globals) {
        if(args.length==0){
            globals.readyPhase = !globals.readyPhase;
            console.log("ready: " + globals.readyPhase);
        }
        else {
            globals.tourneyPhase = !globals.tourneyPhase;
            console.log("tourney: " + globals.tourneyPhase);
        }
        return;
	},
};
