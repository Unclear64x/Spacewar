class Input {
    /**@type {Object<String, Boolean>} */
    static #keys = {};
    
    /**@type {Vector} */
    static Cursor = new Vector(0, 0);

    /**
     * 
     * @param {String} key 
     */
    static keyPressed(key) {
        return Input.#keys[key] == true;
    }

    /**
     * 
     * @param {KeyboardEvent} button 
     * @param {boolean} down 
     */
    static button(button, down = true) {
        Input.#keys[button.code] = down;
    }

    /**
     * 
     * @param {MouseEvent} button 
     * @param {boolean} down 
     */
    static mouseButton(button, down = true) {
        Input.#keys[`Mouse${button.button}`] = down;
    }

    /**
     * 
     * @param {MouseEvent} move 
     */
    static mouseMove(move) {
        Input.Cursor.set(move.clientX - (window.innerWidth / 2), move.clientY - (window.innerHeight / 2));
    }

    static init() {
        window.addEventListener("keydown", (button) => Input.button(button, true));
        window.addEventListener("keyup", (button) => Input.button(button, false));
        window.addEventListener("mousemove", (move) => Input.mouseMove(move));
        window.addEventListener("mousedown", (button) => Input.mouseButton(button, true));
        window.addEventListener("mouseup", (button) => Input.mouseButton(button, false));
    }

    static keys() {
        console.log(Input.#keys);
    }
}

class Button {
    static LMB = "Mouse0";
    static RMB = "Mouse2";
    static W = "KeyW";
    static A = "KeyA";
    static S = "KeyS";
    static D = "KeyD";
    static SPACE = "Space";
}