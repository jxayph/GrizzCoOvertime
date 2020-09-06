module.exports = {
	name: 'test',
	description: 'whatever',
	args: false,
	admin: true,
	execute(message, args, globals) {
        console.log(
            globals.client.userData[message.author.id]
        );
        
        //console.log(globals.client);

        return;
	},
};