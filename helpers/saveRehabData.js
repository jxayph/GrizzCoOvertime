module.exports = {
	saveRehabData(fs, rehab) {
		fs.writeFile('./rehab.json', JSON.stringify(rehab, null, 4), err => {
			if (err) throw err;
		});
	},
};
