
function calcPlayerCounts(variant, target, allowUnbalanced){
    if (variant.player_count_override){
        return variant.player_count_override == target;
    }
    if (variant.min_teams * variant.min_players_per_team > target) return false;

    if (allowUnbalanced){
        if (variant.max_players_per_team == null) return true;  

        // Math stuff
        let t = Math.floor(target/variant.min_players_per_team);
        let r = target % variant.min_players_per_team;
        if (variant.max_teams != null && variant.max_teams < t){
            r += (t-variant.max_teams) * variant.min_players_per_team;
            t = variant.max_teams;
        }
        return r <= t * (variant.max_players_per_team - variant.min_players_per_team);
    }

    let playerCap = variant.max_players_per_team == null ? target : Math.min(target, variant.max_players_per_team)

    for (let i=variant.min_players_per_team; i<=playerCap; i++){
        if (target % i != 0) continue;
        console.log(target / i)
        if (target / i < variant.min_teams) continue;
        if (variant.max_teams != null && target / i > variant.max_teams) continue;
        return true;
    }
    return false;
}

function getVariantList(){
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    query = urlParams.get("q");

    conditions = query.split(" ").filter(n => n);

    filters = [];

    random = false;



    for (let condition of conditions){
        let temp = condition.split(":");
        let key = temp[0];
        let val = temp[1];
        console.log(`${key} : ${val}`)

        if (key == "is") {
            filters.push((variant) => (variant.tags.includes(val)));
        }
        if (key == "not") {
            filters.push((variant) => (!variant.tags.includes(val)));
        }
        if (key == "teams") {
            filters.push((variant) => (variant.min_teams <= val && (variant.max_teams == null || variant.max_teams >= val)));
        }
        if (key == "c") {
            filters.push((variant) => (val.includes(variant.color.charAt(0).toLowerCase())));
        }
        if (key == "players") {
            filters.push((variant) => (calcPlayerCounts(variant, val, false)));
        }
        if (key == "playersun") {
            filters.push((variant) => (calcPlayerCounts(variant, val, true)));
        }
        if (key == "random") {
            random = true;
        }
        if (key == "n") {
            filters.push((variant) => (variant.name.toLowerCase().includes(val.toLowerCase())));
        }
    }

    let result = [];

    for (let variant of variant_list_data) {
        let accept = true;
        for (let filter of filters){
            if (!filter(variant)){
                accept = false;
                break;
            }
        }
        if (accept) {
            result.push(variant);
        }
    }

    return result;
}

function fillSearch(){
    
    result = getVariantList();

    if (random) {
        result = [result[Math.floor(Math.random()*result.length)]];
    }
    else {
        result.sort(orderVariants)
    }

    renderVariants(result);
}