javascript:(function(){
    
    /* Random thing stolen from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript */

    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
    }

    function sfc32(a, b, c, d) {
        return function() {
          a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
          var t = (a + b) | 0;
          a = b ^ b >>> 9;
          b = c + (c << 3) | 0;
          c = (c << 21 | c >>> 11);
          d = d + 1 | 0;
          t = t + d | 0;
          c = c + t | 0;
          return (t >>> 0) / 4294967296;
        }
    }

    let rand;


    let boardSize = 0;

    function getBoardSize(){
        if (boardSize == 0) {
            boardSize = Math.sqrt(document.getElementsByClassName("blanksquare").length);
        }
        return boardSize;
    }

    function setupFlagSprite(){
        var sheet = document.createElement('style');
        sheet.innerHTML = 
        `.starred {  
            background-image: url('https://cdn0.iconfinder.com/data/icons/basic-ui-elements-flat/512/flat_basic_home_flag_-512.png'); 
            margin: auto; 
            height: 50px; 
            width: 50px; 
            top: 20%; 
        }
        `;
        document.body.appendChild(sheet);
    }

    function getCellById(cellNum){
        return document.getElementById("slot" + cellNum)
    }

    function askQuestion(question){
        let responce = window.prompt(question,"");
        return responce;
    }
    function alert(text){
        window.alert(text);
    }

    let mineArray = [];
    let initialized = false;
    let minecount = NaN;
    const TILES = document.querySelectorAll('.square');
    let selectedColor;

    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(rand() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    function setupBoard(initialCellnum){
        getBoardSize();

        let seed = cyrb128(document.getElementById("the-seed").innerText);

        rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

        mineArray.push(null);

        for (let i = 1; i<=boardSize*boardSize; i++){
            mineArray.push(false);
        }

        let notAllowed = [initialCellnum];

        let checkLeft = (initialCellnum % boardSize) != 1;
        let checkUp = initialCellnum > boardSize;
        let checkRight = (initialCellnum % boardSize) != 0;
        let checkDown = initialCellnum <= boardSize * (boardSize - 1);

        if (checkLeft){
            if (checkUp) {
                notAllowed.push(initialCellnum - boardSize - 1);
            }
            if (checkDown) {
                notAllowed.push(initialCellnum + boardSize - 1);
            }
            notAllowed.push(initialCellnum - 1);
        }
        if (checkRight){
            if (checkUp) {
                notAllowed.push(initialCellnum - boardSize + 1);
            }
            if (checkDown) {
                notAllowed.push(initialCellnum + boardSize + 1);
            }
            notAllowed.push(initialCellnum + 1);
        }
        if (checkUp) {
            notAllowed.push(initialCellnum - boardSize);
        }
        if (checkDown) {
            notAllowed.push(initialCellnum + boardSize);
        }

        let tempArray = [];

        for (let i=1; i<=boardSize*boardSize; i++){
            if (!notAllowed.includes(i)){
                tempArray.push(i);
            }
        }

        let selected = getRandom(tempArray, minecount);

        console.log(selected);

        console.log(mineArray);

        for (let i of selected){
            mineArray[i] = true;
        }

        console.log(mineArray);
    }

    function checkIfMine(cellNum){
        console.log(cellNum);
        if (cellNum < 1){
            return 0;
        }
        if (cellNum > mineArray.length){
            return 0;
        }
        if (mineArray[cellNum]){
            return 1;
        }
        return 0;
    }

    function getNumber(cellNum){
        getBoardSize();

        let count = 0;
        
        let checkLeft = (cellNum % boardSize) != 1;
        let checkUp = cellNum > boardSize;
        let checkRight = (cellNum % boardSize) != 0;
        let checkDown = cellNum <= boardSize * (boardSize - 1);

        if (checkLeft){
            if (checkUp) {
                count += checkIfMine(cellNum - boardSize - 1);
            }
            if (checkDown) {
                count += checkIfMine(cellNum + boardSize - 1);
            }
            count += checkIfMine(cellNum - 1);
        }
        if (checkRight){
            if (checkUp) {
                count += checkIfMine(cellNum - boardSize + 1);
            }
            if (checkDown) {
                count += checkIfMine(cellNum + boardSize + 1);
            }
            count += checkIfMine(cellNum + 1);
        }
        if (checkUp) {
            count += checkIfMine(cellNum - boardSize);
        }
        if (checkDown) {
            count += checkIfMine(cellNum + boardSize);
        }

        console.log(`${cellNum} : ${count}`);

        return count;
    }

    function onSquareClick(cellNum){
        if (!initialized){
            setupBoard(cellNum);
            initialized = true;
        }
        if (mineArray[cellNum]){
            alert("You exploded, RIP");
            return;
        }

        let num = getNumber(cellNum);

        let cell = getCellById(cellNum);
        let text = cell.getElementsByClassName("text-container")[0];

        text.innerHTML = num;
        text.style = "font-size: 500%;";

        let revealed = document.getElementsByClassName("bg-color " + selectedColor + "square").length ;

        if (revealed >= boardSize * boardSize - minecount) {
            alert("You win, wooooooooooo!");
        }
    }

    function getTileSlot(tile)
	{
		return Number(tile.id.slice(4));
	}

    function getColor()
	{
		return selectedColor;
	}

    function isTileTicked(tile){
		return tile.title.includes(getColor());
	}

    function tileObserverCallback(mutations)
	{
		const mutation = mutations[0];

		if (mutation.attributeName !== 'title') {return;}

		const slot_number = getTileSlot(mutation.target);

		if (isTileTicked(mutation.target)) {
            onSquareClick(slot_number);
        }
	}

    function colorListener()
	{
		const new_color = this.getAttribute('squarecolor');
		selectedColor = new_color;
	}


    function init(){
        setupFlagSprite();

        minecount = parseInt(askQuestion("How many mines?"));

        while (isNaN(minecount)){
            minecount = parseInt(askQuestion("Number not recognised, how many mines?"));
        }

        for (const tile of TILES)
		{
			const observer = new MutationObserver(tileObserverCallback);
			observer.observe(tile, {attributes: true});
		}

        const color_elements = document.querySelectorAll('.color-chooser');
		for (let i = 0; i < 10; i++)
		{
			color_elements[i].addEventListener('click', colorListener);
		}

        selectedColor = document.querySelector('.chosen-color').getAttribute('squarecolor');
    }

    init();
}())