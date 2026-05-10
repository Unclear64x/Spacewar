let lastTime = 0;

/**@type {Player} */
let player;
/**@type {HTMLElement} */
let space;

/**@type {Object<String, Boolean>} */
let keys = {};

/**@type {Array<DynamicObject>} */
let objects = [];

let move = false;
let velocity = new Vector(0, 0);
let forwardVelocity = new Vector(0, 0);
let rightVelocity = new Vector(0, 0);
let angularVelocity = 0;
let cursor = new Vector(0, 0);

let meteorite;
let physycsDot;

addEventListeners();

function update(currentTime) {
    let delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    playerInput(delta);
    centerAtPlayer();

    physycs();

    for (let i = 0; i < objects.length; i++) {
        objects[i].update(delta);
    }

    requestAnimationFrame(update);
}

function keyPressed(keyCode) {
    return keys[keyCode] == true;
}

function playerInput(delta) {
    forwardVelocity.set(Math.cos(player.angle), Math.sin(player.angle));
    rightVelocity.set(forwardVelocity.y, -forwardVelocity.x);

    let tan = Math.atan2(cursor.y, cursor.x);
    let angle = tan - player.angle;
    
    if (angle < -Math.PI) angle += Math.PI * 2;
    if (angle > Math.PI) angle -= Math.PI * 2;
    
    angularVelocity = (angle - player.angularVelocity / 4);

    velocity.set(0, 0);
    if (keyPressed("KeyW")) {
        velocity.add(forwardVelocity);
    }
    else if (keyPressed("KeyS")) {
        velocity.remove(forwardVelocity);
    }

    if (keyPressed("KeyA")) {
        velocity.add(rightVelocity);
    }
    else if (keyPressed("KeyD")) {
        velocity.remove(rightVelocity);
    }

    player.input(velocity.normalize(), angularVelocity);
}

function centerAtPlayer() {
    let cameraX = window.innerWidth / 2 - player.x;
    let cameraY = window.innerHeight / 2 - player.y;
    space.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
}

function physycs() {
    for (let i = 0; i < objects.length; i++) {
        for (let b = i + 1; b < objects.length; b++) {
            let dot = objects[i].collide(objects[b]);
            
            if (!physycsDot)
                physycsDot = new BaseObject(objects, [], "dot", dotAnimation, "none");

            if (dot != null) {
                physycsDot.x = dot[0].x;
                physycsDot.y = dot[0].y;
                physycsDot.update();
            }
        }
    }
}

function addEventListeners() {
    window.addEventListener("DOMContentLoaded", (e) => {
        space = document.getElementById("space");

        player = new Player(objects, 200000 / 2, 200000 / 2);
        meteorite = new Meteorite(objects, player.x + 200, player.y);
        


        //colliders.push(new Door(colliders, interactable, 200, 0));

        update(0);
    });
    window.addEventListener("keydown", (e) => {
        keys[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
        keys[e.code] = false;
    });
    window.addEventListener("mousemove", (e) => {
        cursor.set(e.clientX - (window.innerWidth / 2), e.clientY - (window.innerHeight / 2));
    })
}