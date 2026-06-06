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

// иконки
let materials = {
    "metal": new Image(),
    "irit": new Image(),
    "borit": new Image(),
    "aneit": new Image()
}

materials["metal"].src = "sprites/materials/metal.png";
materials["irit"].src = "sprites/materials/irit.png";
materials["borit"].src = "sprites/materials/borit.png";
materials["aneit"].src = "sprites/materials/aneit.png";

let metalAnimation = {
    "root": "meteorite",
    "states": {
        "metal": [1, 0]
    }
}

let iritAnimation = {
    "root": "materials",
    "states": {
        "irit": [1, 0]
    }
}

let boritAnimation = {
    "root": "materials",
    "states": {
        "borit": [1, 0]
    }
}

let aneitAnimation = {
    "root": "materials",
    "states": {
        "aneit": [1, 0]
    }
}

let spaceImage = new Image();
spaceImage.src = "sprites/space.png";