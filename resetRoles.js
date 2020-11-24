module.exports =  {
	name: 'resetroles',
    description: 'Reset tournament roles.',
    detailed: 'Removes the registered and active participant roles from all users in the server. Only use this after a tournament concludes.',
	admin: true,
	async execute(message, args, globals) {

        const deletionList = ['Registered',  'Active Participant'];

        for (let i = 0; i < deletionList.length; i++){
            await eraseRole(message, deletionList[i])
               .then(message.channel.send(`Erasure of \'${deletionList[i]}\' complete.`));
        }
	},
};

async function eraseRole(message, roleName){
    const memberList = message.guild.roles.cache.find(role => role.name == roleName).members.map(m=>m.user.id);
    message.channel.send(`Removing role \'${roleName}\' from ${memberList.length} users...`);
    
    for (member of memberList){
        await message.guild.members.cache.get(member).roles.remove(message.guild.roles.cache.find(role => role.name == roleName));
    }
}
