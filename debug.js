class Debug {
    static #enabled = false;

    /**@type {SVGSVGElement} */
    static #canvas;
    static #canvasData = {};

    /**@type {HTMLElement} */
    static #info;
    static #infoData = {};

    static clear() {
        for (let i in Debug.#canvasData) {
            Debug.#canvasData[i].remove();
            delete Debug.#canvasData[i];
        }

        for (let i in Debug.#infoData) {
            delete Debug.#infoData[i];
        }
    }

    static erase(id) {
        if (id in Debug.#canvasData) {
            Debug.#canvasData[id].remove();
            delete Debug.#canvasData[id];
        }

        if (id in Debug.#infoData) {
            delete Debug.#infoData[id];
        }
    }

    static switchVisible() {
        if (Debug.#enabled)
            Debug.clear(true);

        Debug.#setVisible(!Debug.#enabled);
    }

    static #setVisible(value) {
        Debug.#enabled = value;

        Debug.#canvas.style.display = Debug.#enabled ? "inline" : "none";
        Debug.#info.style.display = Debug.#enabled ? "inline" : "none";

        localStorage.setItem("Debug", Debug.#enabled);
    }

    /**
     * Отображает линию по двум точкам в глобальных координатах
     * @param {any} id 
     * @param {Vector} from 
     * @param {Vector} to 
     * @param {String} color 
     * @returns 
     */
    static displayLine(id, from, to, color) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#canvasData[id]) {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            line.setAttribute("fill", "none");
            line.setAttribute("stroke",  color);
            line.setAttribute("stroke-width", "1");
            line.setAttribute("id", id);
            Debug.#canvas.append(line);
            Debug.#canvasData[id] = line;
        }

        Debug.#canvasData[id].setAttribute("points", `${from.x},${from.y} ${to.x},${to.y}`);
    }

    /**
     * Отображает токчку в глобальных координатах
     * @param {any} id 
     * @param {Vector} position
     * @param {String} color 
     * @returns 
     */
    static displayDot(id, position, color) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#canvasData[id]) {
            let dot = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            dot.setAttribute("r", "4");
            dot.setAttribute("fill", color);
            dot.setAttribute("id", id);
            Debug.#canvas.append(dot);
            Debug.#canvasData[id] = dot;
        }

        Debug.#canvasData[id].setAttribute("cx", position.x);
        Debug.#canvasData[id].setAttribute("cy", position.y);
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

        if (!Debug.#canvasData[id]) {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("font-family", "consolas");
            text.setAttribute("font-size", "12");
            text.setAttribute("fill", "lime");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "central");
            text.setAttribute("id", id);
            Debug.#canvas.append(text);
            Debug.#canvasData[id] = text;
        }

        Debug.#canvasData[id].setAttribute("x", position.x);
        Debug.#canvasData[id].setAttribute("y", position.y);
        MultilineSVGText(Debug.#canvasData[id], value);
    }

    /**
     * 
     * @param {String} id 
     * @param {String} value 
     */
    static displayInfo(id, value) {
        if (!Debug.#enabled)
            return;
        
        Debug.#infoData[id] = value;
    }

    static init() {
        Debug.#canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        Debug.#canvas.setAttribute("class", "debugSpace");
        document.getElementById("space").append(Debug.#canvas);

        Debug.#info = document.createElement("pre")
        Debug.#info.setAttribute("class", "debugText debugInfo");
        document.body.append(Debug.#info);

        Debug.#setVisible(localStorage.getItem("Debug") == "true");

        window.addEventListener("mousedown", (e) => {
            if (Input.keyPressed(Button.MMB)) {
                Debug.switchVisible();
            }
        });
    }

    static update() {
        if (!Debug.#enabled)
            return;

        let infoText = "";

        for (let i in Debug.#infoData) {
            infoText += `${i}: ${Debug.#infoData[i]}\n`;
        }

        Debug.#info.innerText = infoText;
    }
}