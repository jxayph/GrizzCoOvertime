module.exports = {
    shuffle(array){
        for (var i = 0; i < array.length; i++){
            var maxIdx = array.length - i;
            var rIdx = Math.floor(Math.random() * maxIdx);
            var temp = array[rIdx];
            array[rIdx] = array[maxIdx - 1];
            array[maxIdx - 1] = temp;
        }
        return array;
    }
}

