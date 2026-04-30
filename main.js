let lastTime = 0;

/**@type {Player} */
let player;
/**@type {HTMLElement} */
let space;

/**@type {Object<String, Boolean>} */
let keys = {};

/**@type {Array<DynamicObject>} */
let objects = [];

addEventListeners();

function update(currentTime) {
    let delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    playerInput(delta);
    centerAtPlayer();

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
    let angularVelocity = 0;

    if (keyPressed("KeyW")) {
        velocity = [Math.cos(player.angle), Math.sin(player.angle)];
    }
    else if (keyPressed("KeyS")) {
        velocity = [-Math.cos(player.angle), -Math.sin(player.angle)];
    }

    if (keyPressed("KeyA")) {
        angularVelocity = -15 * Math.PI / 180;
    }
    else if (keyPressed("KeyD")) {
        angularVelocity = 15 * Math.PI / 180;
    }

    //console.log(velocity, (velocity[0] ** 2 + velocity[1] ** 2) ** 0.5);

    player.addVelocity(velocity, angularVelocity);
}

function centerAtPlayer() {
    let cameraX = window.innerWidth / 2 - player.x;
    let cameraY = window.innerHeight / 2 - player.y;
    space.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
}

function addEventListeners() {
    window.addEventListener("DOMContentLoaded", (e) => {
        space = document.getElementById("space");

        player = new Player(objects, 10000, 10000);

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