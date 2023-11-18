const COLOR_ORDER = {
    "white" : 0,
    "purple" : 1,
    "blue" : 2,
    "green" : 3,
    "orange" : 4,
    "red" : 5,
}

function orderVariants(a, b){
    if (a.name == "Lockout") return -1;
    if (b.name == "Lockout") return 1;
    if (a.name == "Blackout") return -1;
    if (a.name == "Blackout") return 1;

    let val = COLOR_ORDER[a.color.toLowerCase()] - COLOR_ORDER[b.color.toLowerCase()];

    if (val != 0) return val;

    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
}