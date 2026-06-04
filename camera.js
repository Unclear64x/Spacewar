class Camera {
    /**@type {Vector} */
    static focus = new Vector(0, 0);
    
    /**@type {Vector} */
    static dotOfInterest = new Vector(0, 0);

    /**@type {Vector} */
    static position = new Vector(0, 0);

    static canvas;
    /**@type {CanvasRenderingContext2D} */
    static ctx;

    static update() {
        // let distances = [];

        // for (let i in World.DamagableObjects) {
        //     if (World.DamagableObjects[i] == World.Player)
        //         continue;

        //     let object = World.DamagableObjects[i];
        //     let distance = lengthBetween(World.Player.x, World.Player.y, object.x, object.y);

        //     if (distance > MIN_DISTANCE_TO_OBJECT * 10)
        //         continue;

        //     distances.push([distance, object.globalPosition.new()]);
        // }

        Camera.focus.set2(Input.Cursor);
        
        const debugZoom = Debug.isEnabled() ? 5 : 1
        const x = Camera.canvas.width / 2 - World.Player.x - Camera.focus.x * debugZoom;
        const y = Camera.canvas.height / 2 - World.Player.y - Camera.focus.y * debugZoom;

        Input.CursorGlobal.set(-x + Input.Cursor.x, -y + Input.Cursor.y).add2(Camera.canvas.width / 2, Camera.canvas.height / 2);

        const k = 0.1;
        Camera.position.set(lerp(Camera.position.x, x, k), lerp(Camera.position.y, y, k))

        //World.Space.style.transform = `translate(${Camera.position.x}px, ${Camera.position.y}px)`;

        let ctx = Camera.ctx;
        ctx.clearRect(0, 0, Camera.canvas.width, Camera.canvas.height);

        let size = 500;
        let parallax = 1;
        let offsetX = Math.round(((Camera.position.x) * parallax) % size);
        let offsetY = Math.round(((Camera.position.y) * parallax) % size);

        Debug.displayInfo("camera", "camera", `${Camera.position.x} ${Camera.position.y}`);

        ctx.save();
        for (let x = offsetX - size; x - size < Camera.canvas.width; x += size) {
            for (let y = offsetY - size; y - size < Camera.canvas.height; y += size) {
                ctx.drawImage(spaceImage, x | 0, y);
            }
        }
        ctx.restore();

        for (let i in World.Objects) {
            // if (World.Objects[i] instanceof Particle && World.Objects[i].globalPosition.x == 0 && World.Objects[i].globalPosition.y == 0)
            //     console.log(World.Objects[i]);
            World.Objects[i].render(Camera.ctx);
        }

        Camera.debug();
    }

    static debug() {
        Debug.displayDot("cursorPosition", Input.CursorGlobal, "lime");
        Debug.displayDot("cameraPosition", Camera.position.new().multiply(-1).add2(Camera.canvas.width / 2, Camera.canvas.height / 2), "red");
    }

    static init() {
        Camera.canvas = document.getElementById("canvas");
        Camera.ctx = Camera.canvas.getContext("2d");
    }
}