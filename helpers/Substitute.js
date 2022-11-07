module.exports = class Substitute {
	constructor(userID) {
		this.userID = userID;
		this.squad = '';
		this.assigned = false;
	}

	getMention() {
		return `<@${this.userID}>`;
	}
};
