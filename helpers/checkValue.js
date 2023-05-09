module.exports = {

	checkValue(value, user) { // Value is a parsed int, user is userData object

		if (isNaN(value) || !isFinite(value)) return false; // Return false for NaN or infinite values

		if (user) { // If a userData object is supplied
			return ((value <= user.balance) && (value >= 0)); // Check against their balance
		}

		else { // If no userData object is supplied, return true for integers.
			return true;
		}
	},
};
