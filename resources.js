let MIN_DISTANCE_TO_OBJECT = ((64 ** 2) * 2) ** 0.5;

let gunAnimation = {
    "root": "gun",
    "states": {
        "idle": [1, 1000],
        "fire": [4, 50] // зависит от скорострельности
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

let materials = {
    "metal": "materials/metal/icon.png",
    "irit": "materials/irit/icon.png",
    "borit": "materials/borit/icon.png",
    "aneit": "materials/aneit/icon.png"
}

let MetalAnimation = {
    "root": "materials/metal",
    "states": {
        "none": [5, 200]
    }
}

let IritAnimation = {
    "root": "materials/irit",
    "states": {
        "none": [5, 200]
    }
}

let BoritAnimation = {
    "root": "materials/borit",
    "states": {
        "none": [5, 200]
    }
}

let AneitAnimation = {
    "root": "materials/aneit",
    "states": {
        "none": [5, 200]
    }
}