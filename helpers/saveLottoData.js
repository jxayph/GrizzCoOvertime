module.exports = {
	saveLottoData(fs, client) {
		fs.writeFile('./lotto.json', JSON.stringify(client.lotto, null, 4), err => {
			if (err) throw err;
		});
	},
};
