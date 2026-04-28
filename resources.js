let stickmanAnimation = {
    "root": "player",
    "type": "dynamic",
    "states": {
        "idle": [4, 80],
        "move": [4, 80]
    }
};

let doorAnimation = {
    "root": "door",
    "type": "static",
    "states": {
        "closed": "0",
        "opened": "1"
    }
};

let gunAnimation = {
    "root": "gun",
    "type": "dynamic",
    "states": {
        "idle": [1, 1000],
        "fire": [4, 100] // зависит от скорострельности
    }
}

let shipAnimation = {
    "root": "ship",
    "type": "dynamic",
    "states": {
                //кол-во фреймов, время между фреймами (мс)
        "idle": [2, 80],
        "move": [4, 80]
    }
}

let asteroidAnimation = {
    "root": "asteroid",
    "type": "static",
    "states": {
        "none": "0",
        "damaged": "1"
    }
}