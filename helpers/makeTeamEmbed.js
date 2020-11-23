module.exports = {
    makeTeamEmbed(teamMembers, teamNum, currentRound){
        const iconURL = 'https://cdn.discordapp.com/avatars/518861328526606347/b2774300463506104c08ee2d878f7459.png?size=128';
        const teamEmbed = {
            title: `[Squad ${(teamNum + 1)}] Round ${(currentRound + 1)}`,
            description: "Meet your squad!",
            thumbnail: {
                url: iconURL,
            },
            fields: [],
            timestamp: new Date(),
            footer: {
                text: 'Now go out there and get me some golden eggs!',
                icon_url: iconURL,  
            },
            
        };
    
        for(let i = 0; i < 4; i++){
            if (teamMembers[i] == undefined) {
                teamEmbed.fields.push({
                    name: "Freelancer",
                    value: "N/A"
                });
            } else{
                teamEmbed.fields.push({
                    name: teamMembers[i].IGN,
                    value: teamMembers[i].FC
                });
            }
        }
    
        return({embed:teamEmbed});
    }
}