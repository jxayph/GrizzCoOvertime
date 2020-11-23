module.exports = class Player{
    constructor(IGN, FC, userID){
        this.IGN = IGN;
        this.FC = FC;        
        this.userID = userID;
        this.scores = [];
        this.teamDC = [];
        this.randoms = [];
    }

    getMention(){
        return `<@${this.userID}>`;
    }

    getScore(){ // might want to have an argument for string or number version
        return 'Score placeholder'
    }

}
