class Input {
    /**@type {Object<String, Boolean>} */
    static #keys = {};
    static #requests = {};
    
    /**@type {Vector} */
    static Cursor = new Vector(0, 0);
    /**@type {Vector} */
    static CursorGlobal = new Vector(0, 0);

    /**
     * 
     * @param {String} key 
     */
    static keyPressed(key) {
        return Input.#keys[key] == true;
    }

    static keyJustPressed(key, request) {
        if (this.keyPressed(key) && Input.#requests[key] && !Input.#requests[key].includes(request)) {
            Input.#requests[key].push(request);
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {KeyboardEvent} button 
     * @param {boolean} down 
     */
    static button(button, down = true) {
        if (!down) {
            Input.#requests[button.code] = [];
        }
        Input.#keys[button.code] = down;
        Debug.displayInfo("input", "Buttons", Object.keys(Input.#keys).filter((x) => Input.#keys[x]));
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
        let widthK = window.innerWidth / Camera.canvas.width;
        let heightK = window.innerHeight / Camera.canvas.height;
        Input.Cursor.set((move.clientX - (window.innerWidth / 2)) / widthK, (move.clientY - (window.innerHeight / 2)) / heightK);
    }

    static requests() {
        return Input.#requests;
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
    static MMB = "Mouse1";
    static RMB = "Mouse2";

    static W = "KeyW";
    static A = "KeyA";
    static S = "KeyS";
    static D = "KeyD";
    static SPACE = "Space";
    static SHIFT = "ShiftLeft";
    static ESC = "Escape";
    static D1 = "Digit1";
    static D2 = "Digit2";
    static D3 = "Digit3";
    static D4 = "Digit4";
    static D5 = "Digit5";
    static D6 = "Digit6";
    static D7 = "Digit7";
    static D8 = "Digit8";
    static D9 = "Digit9";
    static D0 = "Digit0";
    static Backquote = "Backquote";
}