class Camera {
    /**@type {Vector} */
    static focus = new Vector(0, 0);
    
    /**@type {Vector} */
    static dotOfInterest = new Vector(0, 0);

    /**@type {Vector} */
    static position = new Vector(0, 0);

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
        
        let x = window.innerWidth / 2 - World.Player.x - Camera.focus.x;
        let y = window.innerHeight / 2 - World.Player.y - Camera.focus.y;

        Input.CursorGlobal.set(-x + Input.Cursor.x, -y + Input.Cursor.y).add2(window.innerWidth / 2, window.innerHeight / 2);

        const k = 0.1;
        Camera.position.set(lerp(Camera.position.x, x, k), lerp(Camera.position.y, y, k))

        World.Space.style.transform = `translate(${Camera.position.x}px, ${Camera.position.y}px)`;
    }

    static debug() {
        Debug.displayDot("cameraFocus", Camera.focus.new().add(World.Player.globalPosition), "lime");
        Debug.displayDot("cursorPosition", Input.CursorGlobal, "red");
        Debug.displayDot("cameraPosition", Camera.position.new().multiply(-1).add2(window.innerWidth / 2, window.innerHeight / 2), "red");
    }
}