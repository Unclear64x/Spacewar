/**============== ввод игрока ========= */
let velocity = new Vector(0, 0);
let forwardVelocity = new Vector(0, 0);
let rightVelocity = new Vector(0, 0);
let angularVelocity = 0;
/**============== ввод игрока ========= */

addEventListeners();

let pause = false;
let run = false;

let lastTime = 0;
let deltaTime = 0;
function update(currentTime) {
    if (!run)
        return;

    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    input();

    if (!pause) {
        playerInput(deltaTime);
        //centerCameraAtPlayer();

        physycs();

        for (let i in World.Objects) {
            World.Objects[i].update(deltaTime);
        }

        GameManager.update();

        Debug.displayInfo("main", "UPS", 1000 / deltaTime);
        Debug.displayInfo("main", "Objects", Object.keys(World.Objects).length);
        Debug.displayInfo("main", "DynamicObjects", Object.keys(World.DynamicObjects).length);

        Camera.update();
        Debug.update(Camera.ctx);
    }

    requestAnimationFrame(update);
}

function playerInput(deltaTime) {
    if (World.Player.destroyed)
        return;

    forwardVelocity.set(World.Player.forward.x, World.Player.forward.y);
    rightVelocity.set(forwardVelocity.y, -forwardVelocity.x);

    let tan = Math.atan2(Input.Cursor.y, Input.Cursor.x);
    let angle = tan - World.Player.angle;
    
    while (angle < -Math.PI) angle += Math.PI * 2;
    while (angle > Math.PI) angle -= Math.PI * 2;
    
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

    let boost = Input.keyPressed(Button.SHIFT);

    World.Player.input(velocity.normalize(), angularVelocity, deltaTime, boost);
    World.Player.lookGunAt(Input.CursorGlobal);
    if (Input.keyPressed(Button.LMB))
        World.Player.fire();
}

function input() {
    if (Input.keyJustPressed(Button.BACKQ, "debug")) {
        Debug.switchVisible();
    }

    if (Input.keyJustPressed(Button.ESC, "pause")) {
        pause = !pause;
        console.log("pause");
    }
}

function centerCameraAtPlayer() {
    let cameraX = window.innerWidth / 2 - World.Player.x;
    let cameraY = window.innerHeight / 2 - World.Player.y;
    World.Space.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
}

function physycs() {
    let collided = {};

    let ids = Object.keys(World.DynamicObjects);
    for (let i = 0; i < ids.length; i++) {
        if (!collided[i])
            collided[i] = [];
        for (let b = i + 1; b < ids.length; b++) {
            if (!collided[b])
                collided[b] = [];

            if (collided[i].includes(b) || !World.DynamicObjects[ids[i]] || !World.DynamicObjects[ids[b]])
                continue;

            let dot = World.DynamicObjects[ids[i]].collide(World.DynamicObjects[ids[b]]);

            if (dot) {
                collided[b].push(i);
                collided[i].push(b);
            }
        }
    }
}

function resize() {
    let size = 1440;
    
    //console.log(window.devicePixelRatio);
    let width = window.innerWidth;
    let height = window.innerHeight;

    let k = Math.max(width, height) / size;

    if (width > height) {
        Camera.canvas.width = size;
        Camera.canvas.height = height / k;
    }
    else {
        Camera.canvas.width = width / k;
        Camera.canvas.height = size;
    }

    // console.log(size / width);
    // console.log(size / height);
    console.log(width, height, k, window.devicePixelRatio);
    console.log(Camera.canvas.width, Camera.canvas.height);
    console.log();

    //Camera.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
}

function initGame() {
    run = true;
    World.clear();
    World.Player = new Player(0, 0, PlayerInfo.ShipParameters);
    update(0);
}

function endGame(momental = false) {
    save();
    updateUpgrades();
    if (!momental) {
        destroyed.style.visibility = "visible";
        destroyed.style.opacity = 1;
        setTimeout(() => {
            destroyed.style.opacity = 0;
            setTimeout(() => {
                destroyed.style.visibility = "collapse";
                run = false;
                World.clear();
                menu.style.display = "flex";
            }, 2000);
        }, 3000);
    }
    
    velocity.multiply(0);
    forwardVelocity.multiply(0);
    rightVelocity.multiply(0);
    angularVelocity = 0;
}

function load() {
    PlayerInfo.load();
    if (localStorage) {
        guiSize.value = Number(localStorage["guiSize"]) || 0;
        document.body.style.setProperty("--size-addition", guiSize.value + "vmin");
    }
}

function save() {
    PlayerInfo.save();
}

function addEventListeners() {
    window.addEventListener("DOMContentLoaded", (e) => {
        Input.init();
        Debug.init();
        Camera.init();
        World.ObjectDatas = document.getElementById("objectDatas");

        start.addEventListener("click", () => {
            initGame();
            menu.style.display = "none";
        });

        window.addEventListener("resize", resize);

        //World.Space = document.getElementById("space");
        //World.Space.addEventListener('dragstart', (e) => e.preventDefault());

        resize();

        load();
        createUpgrades();
    });
}