class Debug {
    static #enabled = false;

    static #data = {};
    static #infoData = {};

    static isEnabled() {
        return Debug.#enabled;
    }

    static fontSize = 16;

    static clear() {
        for (let i in Debug.#data) {
            // Debug.#data[i].remove();
            delete Debug.#data[i];
        }

        for (let i in Debug.#infoData) {
            delete Debug.#infoData[i];
        }
    }

    static erase(id) {
        if (id in Debug.#data) {
            //Debug.#data[id].remove();
            delete Debug.#data[id];
        }

        if (id in Debug.#infoData) {
            delete Debug.#infoData[id];
        }
    }

    static switchVisible() {
        if (Debug.#enabled)
            Debug.clear(true);

        Debug.#setVisible(!Debug.#enabled);

        return Debug.#enabled;
    }

    static #setVisible(value) {
        Debug.#enabled = value;

        // Debug.#canvas.style.display = Debug.#enabled ? "inline" : "none";
        // Debug.#info.style.display = Debug.#enabled ? "inline" : "none";

        localStorage.setItem("Debug", Debug.#enabled);
    }

    /**
     * Отображает линию по двум точкам в глобальных координатах
     * @param {any} id 
     * @param {Vector} from 
     * @param {Vector} to 
     * @param {String} color 
     */
    static displayLine(id, from, to, color) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#data[id]) 
            Debug.#data[id] = {"type": "line"};

        Debug.#data[id].fromX = from.x;
        Debug.#data[id].fromY = from.y;
        Debug.#data[id].toX = to.x;
        Debug.#data[id].toY = to.y;
        Debug.#data[id].color = color;
        // Debug.#data[id].setAttribute("points", `${from.x},${from.y} ${to.x},${to.y}`);
    }

    /**
     * Отображает токчку в глобальных координатах
     * @param {any} id 
     * @param {Vector} position
     * @param {String} color 
     * @returns 
     */
    static displayDot(id, position, color,) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#data[id])
            Debug.#data[id] = {"type": "dot"};


        Debug.#data[id].x = position.x;
        Debug.#data[id].y = position.y;
        Debug.#data[id].color = color;
        // Debug.#data[id].setAttribute("cx", position.x);
        // Debug.#data[id].setAttribute("cy", position.y);
    }

    /**
     * 
     * @param {any} id 
     * @param {Vector} position 
     * @param {String} value
     * @returns 
     */
    static displayText(id, position, value) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#data[id])
            Debug.#data[id] = {"type": "text"};

        Debug.#data[id].x = position.x;
        Debug.#data[id].y = position.y;
        Debug.#data[id].value = value;

        // Debug.#data[id].setAttribute("x", position.x);
        // Debug.#data[id].setAttribute("y", position.y);
        // MultilineSVGText(Debug.#data[id], value);
    }

    /**
     * 
     * @param {String} group
     * @param {String} id 
     * @param {String} value 
     */
    static displayInfo(group, id, value) {
        if (!Debug.#enabled)
            return;

        if (!group)
            group = "other";
        
        if (!Debug.#infoData[group])
            Debug.#infoData[group] = {};

        Debug.#infoData[group][id] = value;
    }

    static update() {
        let ctx = Camera.ctx;

        let y = 10;
        let x = 10;

        for (let i in Debug.#infoData) {
            Debug.#drawInfo(ctx, x, y, Debug.fontSize + 2, i.toUpperCase());
            y += Debug.fontSize + 4;
            x += 10;

            for (let b in Debug.#infoData[i]) {
                Debug.#drawInfo(ctx, x, y, Debug.fontSize, `${b}: ${Debug.#infoData[i][b]}`);
                y += Debug.fontSize + 2;
            }

            y += 10;
            x -= 10;
        }

        for (let i in Debug.#data) {
            Debug.#draw(ctx, Debug.#data[i]);
        }
    }

    static #drawInfo(ctx, x, y, fontSize, text) {
        ctx.save();
        ctx.translate(x, y);
        ctx.font = `bold ${fontSize}px consolas`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "lime";
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {*} object 
     */
    static #draw(ctx, object) {
        ctx.save();

        let x = Camera.position.x;
        let y = Camera.position.y;

        switch (object.type) {
            case "text":
                ctx.translate(object.x + x, object.y + y);
                ctx.font = `bold ${Debug.fontSize}px consolas`;
                ctx.fillStyle = "lime";
                ctx.textAlign = "center";
                ctx.fillText(object.value, 0, 0);
                break;
            
            case "line":
                ctx.translate(object.fromX + x, object.fromY + y);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(object.toX - object.fromX, object.toY - object.fromY);
                ctx.strokeStyle = object.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                break;
            
            case "dot":
                ctx.translate(object.x + x, object.y + y);
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2)
                ctx.fillStyle = object.color;
                ctx.fill();
        }
        
        ctx.restore();
    }

    static init() {
        // Debug.#canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Debug.#canvas.setAttribute("class", "debugSpace");
        // document.getElementById("space").append(Debug.#canvas);

        // Debug.#info = document.createElement("pre")
        // Debug.#info.setAttribute("class", "debugText debugInfo");
        // document.body.append(Debug.#info);

        Debug.#setVisible(localStorage.getItem("Debug") == "true");

        // window.addEventListener("mousedown", (e) => {
        //     if (Input.keyPressed(Button.MMB)) {
        //         Debug.switchVisible();
        //     }
        // });
    }
}