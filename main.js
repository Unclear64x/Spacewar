let lastTime = 0;

let player;
let keys = {};
let colliders = [];
let interactable = [];

addEventListeners();

function update(currentTime) {
    let delta = currentTime - lastTime;
    lastTime = currentTime;

    playerInput(delta);

    requestAnimationFrame(update);
}

function keyPressed(keyCode) {
    return keys[keyCode] == true;
}

function playerInput(delta) {
    if (keyPressed("KeyA")) {
        player.move(-delta, colliders)
    }
    else if (keyPressed("KeyD")) {
        player.move(delta, colliders)
    }
}

function addEventListeners() {
    window.addEventListener("keydown", (e) => {
        keys[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
        keys[e.code] = false;
    });
    window.addEventListener("DOMContentLoaded", (e) => {
        player = new Player(colliders, interactable, 10, 0);

        colliders.push(new Door(colliders, interactable, 200, 0));
    });

    update(0);
}