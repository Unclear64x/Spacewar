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
    "states": {
        "idle": [1, 1000],
        "fire": [4, 100] // зависит от скорострельности
    }
}

let shipAnimation = {
    "root": "ship",
    "states": {
                //кол-во фреймов, время между фреймами (мс)
        "idle": [2, 1000],
        "move": [4, 200]
    }
}

let asteroidAnimation = {
    "root": "asteroid",
    "states": {
        "none": [1, 0],
        "damaged": [1, 0]
    }
}