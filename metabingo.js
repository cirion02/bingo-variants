
// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateBoard(){
    result = getVariantList();

    if (result.length < 25){
        document.getElementById("fail-text").innerText = "Your search does not contain 25 variants, please try again with a different search."
        document.getElementById("grid").style = "display:none;"
        return
    }

    shuffleArray(result)

    for (let i = 0; i<25; i++){
        document.getElementById("slot" + i).innerText = result[i].name
    }
}