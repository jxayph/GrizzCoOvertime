module.exports = {
	saveUserData(fs, client) {
		fs.writeFile('./userData.json', JSON.stringify(client.userData, null, 4), err => {
			if (err) throw err;
		});
	},
};
