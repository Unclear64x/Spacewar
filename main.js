/**============== ввод игрока ========= */
let move = false;
let velocity = new Vector(0, 0);
let forwardVelocity = new Vector(0, 0);
let rightVelocity = new Vector(0, 0);
let angularVelocity = 0;

let cursor = new Vector(0, 0);
let cursorGlobal = new Vector(0, 0);
/**============== ввод игрока ========= */

addEventListeners();

let lastTime = 0;
let delta = 0;
function update(currentTime) {
    delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    playerInput(delta);
    centerCameraAtPlayer();

    physycs();

    for (let i = 0; i < World.Objects.length; i++) {
        World.Objects[i].update(delta);
    }

    requestAnimationFrame(update);
}

function playerInput(delta) {
    forwardVelocity.set(World.Player.forward.x, World.Player.forward.y);
    rightVelocity.set(forwardVelocity.y, -forwardVelocity.x);

    let tan = Math.atan2(Input.Cursor.y, Input.Cursor.x);
    let angle = tan - World.Player.angle;
    
    if (angle < -Math.PI) angle += Math.PI * 2;
    if (angle > Math.PI) angle -= Math.PI * 2;
    
    angularVelocity = (angle - World.Player.angularVelocity / 4);

    velocity.set(0, 0);
    if (Input.keyPressed(Button.W)) {
        velocity.add(forwardVelocity);
    }
    else if (Input.keyPressed(Button.S)) {
        velocity.remove(forwardVelocity);
    }

    if (Input.keyPressed(Button.A)) {
        velocity.add(rightVelocity);
    }
    else if (Input.keyPressed(Button.D)) {
        velocity.remove(rightVelocity);
    }

    World.Player.input(velocity.normalize().multiply(3), angularVelocity);
    World.Player.lookGunAt(Input.CursorGlobal);
    if (Input.keyPressed(Button.LMB))
        World.Player.fire();
}

function centerCameraAtPlayer() {
    let cameraX = window.innerWidth / 2 - World.Player.x;
    let cameraY = window.innerHeight / 2 - World.Player.y;
    World.Space.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
}

function physycs() {
    let collided = {};

    for (let i = 0; i < World.DynamicObjects.length; i++) {
        if (!collided[i])
            collided[i] = [];
        for (let b = i + 1; b < World.DynamicObjects.length; b++) {
            if (!collided[b])
                collided[b] = [];

            if (collided[i].includes(b))
                continue;

            let dot = World.DynamicObjects[i].collide(World.DynamicObjects[b]);

            if (dot) {
                collided[b].push(i);
                collided[i].push(b);
            }
        }
    }
}

function addEventListeners() {
    window.addEventListener("DOMContentLoaded", (e) => {
        Input.init();

        World.Space = document.getElementById("space");

        World.Player = new Player(200000 / 2, 200000 / 2);
        new Meteorite(World.Player.x + 200, World.Player.y);

        update(0);
    });
}