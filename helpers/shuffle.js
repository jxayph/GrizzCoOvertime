module.exports = {
	shuffle(array) {
		for (let i = 0; i < array.length; i++) {
			const maxIdx = array.length - i;
			const rIdx = Math.floor(Math.random() * maxIdx);
			const temp = array[rIdx];
			array[rIdx] = array[maxIdx - 1];
			array[maxIdx - 1] = temp;
		}
		return array;
	},
};

