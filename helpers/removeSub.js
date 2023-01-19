module.exports = {
	removeSub(globals, subID) {
		console.log(globals.subQueue);
		let index = -1;
		for (let i = 0; (i < globals.subQueue.length) && (index == -1); i++) { // Search for the index of the sub to be removed
			if (globals.subQueue[i].userID == subID) {
				index = i;
			}
		}
		if (index !== -1) {
			globals.subQueue.splice(index, 1);
		}
		console.log(globals.subQueue);
		return;
	},
};
