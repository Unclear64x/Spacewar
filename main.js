let lastTime = 0;

/**@type {Player} */
let player;

let keys = {};

/**@type {Array<DynamicObject>} */
let objects = [];

addEventListeners();

function update(currentTime) {
    let delta = currentTime - lastTime;
    lastTime = currentTime;

    playerInput(delta);

    for (let i = 0; i < objects.length; i++) {
        objects[i].update(delta);
    }

    requestAnimationFrame(update);
}

function keyPressed(keyCode) {
    return keys[keyCode] == true;
}

function playerInput(delta) {
    let velocity = [0, 0];
    let speed = 0.01;

    if (keyPressed("KeyA")) {
        velocity[0] = -speed;
    }
    else if (keyPressed("KeyD")) {
        velocity[0] = speed;
    }

    if (keyPressed("KeyW")) {
        velocity[1] = speed;
    }
    else if (keyPressed("KeyS")) {
        velocity[1] = -speed;
    }

    player.addVelocity(velocity, 0);
}

function addEventListeners() {
    window.addEventListener("DOMContentLoaded", (e) => {
        player = new Player(objects, 10, 0);

        //colliders.push(new Door(colliders, interactable, 200, 0));

        update(0);
    });
    window.addEventListener("keydown", (e) => {
        keys[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
        keys[e.code] = false;
    });
}