module.exports = {
	savePlayerData(fs, players) {
		fs.writeFile('./playerData.json', JSON.stringify(players, null, 4), err => {
			if (err) throw err;
		});
	},
};
