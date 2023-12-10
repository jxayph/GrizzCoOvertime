module.exports = {
	name: 'jhanks',
	description: 'jor jhe jind jouls.',
	detailed: 'j)',
	admin: false,
	execute(message, args, globals) {
		message.react('🇯');
		message.reply({ content: 'jou\'re jelcome!' });
	},
};