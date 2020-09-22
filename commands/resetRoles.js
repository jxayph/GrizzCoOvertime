module.exports = {
	name: 'resetroles',
    description: 'Reset tournament roles.',
    detailed: 'Removes the registered and active participant roles from all users in the server. Only use this after a tournament concludes.',
	admin: true,
	execute(message, args, globals) {
        eraseRole(message, 'Registered');
        eraseRole(message, 'Active Participant');
        return;
	},
};

function eraseRole(message, roleName){
    const memberList = message.guild.roles.cache.find(role => role.name == roleName).members.map(m=>m.user.id);
    console.log(memberList);
    message.channel.send('Removing role \'' + roleName + '\' from ' + memberList.length + " users...");
    
    for (member of memberList){
        message.guild.members.cache.get(member).roles.remove(message.guild.roles.cache.find(role => role.name == roleName));
    }
}
