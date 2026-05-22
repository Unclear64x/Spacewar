let MIN_DISTANCE_TO_OBJECT = ((64 ** 2) * 2) ** 0.5;

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

let meteoriteAnimation = {
    "root": "meteorite",
    "states": {
        "none": [1, 0],
        "damaged": [1, 0]
    }
}

let dotAnimation = {
    "root": "dot",
    "states": {
        "none": [1, 0]
    }
}