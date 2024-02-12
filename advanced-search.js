
//window.location = 
const COLORS = ["white", "purple", "blue", "green", "orange", "red"];

function search(random){
    let queryString = "search-result.html?q=";

    let colorString = "";
    for (let c of COLORS){
        if (document.getElementById("color-" + c).checked){
            colorString += c.charAt(0);
        }
    }
    if (colorString.length != COLORS.length){
        queryString += `c:${colorString}+`;
    }

    let playerCount = parseInt(document.getElementById("player-count").value)
    if (playerCount > 0){
        if (document.getElementById("allow-unbalanced").checked){
            queryString += `playersun:${playerCount}+`;
        }
        else {
            queryString += `players:${playerCount}+`;
        }
    }

    let teamCount = parseInt(document.getElementById("team-count").value)
    if (teamCount > 0){
        queryString += `teams:${teamCount}+`;
    }

    if (document.getElementById("only-blackout").checked) {
        queryString += `is:blackout+`;
    }

    if (document.getElementById("only-lockout").checked) {
        queryString += `is:lockout+`;
    }

    if (document.getElementById("no-unplayable").checked) {
        queryString += `not:unplayable+`;
    }

    if (document.getElementById("no-cursed").checked) {
        queryString += `not:cursed+`;
    }

    let name = document.getElementById("name-search").value.toLowerCase().trim();
    if (name != "") {
        let words = name.split(' ');
        for(let word of words){
            queryString += `n:${word}+`;
        }
    }

    if (random) {
        queryString += `random:true+`;
    }


    if (queryString.charAt(queryString.length-1) == "+"){
        queryString = queryString.slice(0, -1);
    }

    window.location = queryString
}