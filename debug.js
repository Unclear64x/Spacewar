class Debug {
    static #enabled = false;

    /**@type {SVGSVGElement} */
    static #displayedLinesObject;
    /**@type {Object<any, SVGPolylineElement>} */
    static #displayedLines = {};

    /**@type {Object<any, BaseObject>} */
    static #displayedDots = {};

    /**@type {Object<any, BaseObject>} */
    static #displayedTexts = {};

    /**@type {HTMLElement} */
    static #displayedInfoObject;
    /**@type {Object<String, String>} */
    static #displayedInfos = {};

    /**@type {SVGSVGElement} */
    static #canvas;
    static #data = {};

    static clear() {
        for (let i in Debug.#displayedLines) {
            Debug.#displayedLines[i].remove();
            delete Debug.#displayedLines[i];
        }
        for (let i in Debug.#displayedDots) {
            Debug.#displayedDots[i].destroy();
            delete Debug.#displayedDots[i];
        }
        for (let i in Debug.#displayedTexts) {
            Debug.#displayedTexts[i].destroy();
            delete Debug.#displayedTexts[i];
        }
    }

    static getAll() {
        return [Debug.#displayedLines, Debug.#displayedDots, Debug.#displayedTexts];
    }

    static switchVisible() {
        if (Debug.#enabled)
            Debug.clear(true);
        Debug.#enabled = !Debug.#enabled;

        if (Debug.#displayedInfoObject)
            Debug.#displayedInfoObject.style.display = Debug.#enabled ? "inline" : "none";

        localStorage.setItem("Debug", Debug.#enabled);
    }

    /**
     * Отображает линию по двум точкам в глобальных координатах
     * @param {any} lineId 
     * @param {Vector} dot1 
     * @param {Vector} dot2 
     * @param {String} color 
     * @returns 
     */
    static displayLine(lineId, dot1, dot2, color) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#displayedLinesObject) {
            Debug.#displayedLinesObject = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            Debug.#displayedLinesObject.setAttribute("class", "debugSpace");
            document.getElementById("space").append(Debug.#displayedLinesObject);
        }

        if (!Debug.#displayedLines[lineId]) {
            let polyLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            polyLine.setAttribute("fill", "none");
            polyLine.setAttribute("stroke",  color);
            polyLine.setAttribute("stroke-width", "2");
            polyLine.setAttribute("id", lineId);
            Debug.#displayedLinesObject.append(polyLine);
            Debug.#displayedLines[lineId] = polyLine;
        }

        Debug.#displayedLines[lineId].setAttribute("points", `${dot1.x},${dot1.y} ${dot2.x},${dot2.y}`);
    }

    /**
     * Отображает токчку в глобальных координатах
     * @param {any} dotId 
     * @param {Vector} position
     * @param {String} color 
     * @returns 
     */
    static displayDot(dotId, position, color) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#displayedDots[dotId]) {
            let dot = new BaseObject(dotId, null, null);
            dot.img = document.createElement("div");
            dot.img.setAttribute("class", "debugDot");
            dot.img.style.backgroundColor = color;
            dot.object.setAttribute("id", dotId);
            dot.object.appendChild(dot.img);
            Debug.#displayedDots[dotId] = dot;
        }

        Debug.#displayedDots[dotId].x = position.x;
        Debug.#displayedDots[dotId].y = position.y;
    }

    /**
     * 
     * @param {any} textId 
     * @param {Vector} position 
     * @param {String} value
     * @returns 
     */
    static displayText(textId, position, value) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#displayedTexts[textId]) {
            let text = new BaseObject(textId, null, null);
            text.object.setAttribute("class", "debugText");
            text.object.setAttribute("id", textId);
            Debug.#displayedTexts[textId] = text;
        }

        Debug.#displayedTexts[textId].object.innerText = value;
        Debug.#displayedTexts[textId].x = position.x;
        Debug.#displayedTexts[textId].y = position.y;
    }

    /**
     * 
     * @param {String} infoId 
     * @param {String} value 
     */
    static displayInfo(infoId, value) {
        if (!Debug.#enabled)
            return;

        if (!Debug.#displayedInfoObject) {
            Debug.#displayedInfoObject = document.createElement("pre")
            Debug.#displayedInfoObject.setAttribute("class", "debugText debugInfo");
            document.body.append(Debug.#displayedInfoObject);
        }
        
        Debug.#displayedInfos[infoId] = value;

        let text = "";

        for (let i in Debug.#displayedInfos) {
            text += `${i}: ${Debug.#displayedInfos[i]}\n`;
        }

        Debug.#displayedInfoObject.innerText = text;
    }

    static load() {
        Debug.#enabled = localStorage.getItem("Debug") == "true";
    }
}