module.exports = {
    name: 'toggledebug',
    description: 'toggle debug mode',
    detailed: 'yes',
    admin: true,
    execute(message, args, globals) {
        globals.debug = !globals.debug;
        message.channel.send(`Setting debug to \`${globals.debug}\``);
    },
};