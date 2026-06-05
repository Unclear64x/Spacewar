class ObjectData {
    update(deltaTime) {}
    remove() {}
}

class GameObjectData extends ObjectData {
    /**@type {Vector} */
    target;
    /**@type {HTMLElement} */
    data;
    info;
    /**@type {HTMLElement} */
    container;

    visible = false;
    scan = 0;
    loaded = false;

    createdInfo = {};

    scanTime = 2;

    /**
     * @param {Vector} target
    */
    constructor(target, info) {
        super();

        this.target = target;
        this.info = info;

        this.create();
    }

    update(deltaTime) {
        let distance = Camera.position.new().add(this.target).remove2(Camera.canvas.width / 2, Camera.canvas.height / 2);
        //console.log(distance.x, distance.y, " | ", this.target.x, this.target.y);
        
        let test = Math.abs(distance.x) + 70 <= Camera.canvas.width / 2 && Math.abs(distance.y) + 70 <= Camera.canvas.height / 2;
        if (test && this.scan < this.scanTime) {
            if (this.scan == 0) {
                this.addInfo("Скан", {
                    "type": "progress",
                    "object": this,
                    "valueName": ["scan"],
                    "maxValueName": ["scanTime"]
                });
            }
            this.scan += deltaTime;
            if (!this.visible) {
                this.data.style.setProperty("--progress-background", "green");
                this.data.style.setProperty("--progress-bar-background", "lime");
            }
            this.visible = true;
        }
        else if (!test && this.visible) {
            this.scan = 0;
            this.visible = false;
            this.loaded = false;
            for (let i in this.createdInfo) {
                this.removeInfo(i);
            }
        }

        this.data.style.visibility = this.visible ? "visible" : "collapse";

        if (this.scan >= this.scanTime && this.visible && !this.loaded) {
            this.loaded = true;
            this.removeInfo("Скан");

            for (let i in this.info) {
                this.addInfo(i, this.info[i]);
            }

            this.scanTime = Math.max(0.5, this.scanTime - this.scanTime / 2);
        }
        else if (this.loaded && !this.visible) {
            for (let i in this.createdInfo) {
                this.removeInfo(i);
            }
        }

        for (let i in this.createdInfo) {
            this.updateInfo(i);
        }

        let position = globalToScreenPosition(this.target);
        this.data.style.transform = `translate(${position.x}px, ${position.y}px)`;
        //console.log(this.data.style.transform);
    }

    remove() {
        this.data?.remove();
        this.data = null;
    }

    create() {
        this.data = document.createElement("div");
        this.data.setAttribute("class", "infoDot");

        this.data.style.visibility = "collapse";

        this.container = document.createElement("div");
        this.container.setAttribute("class", "infoContainer");

        let square = document.createElement("div");
        square.setAttribute("class", "squareInfo");
        
        this.container.append(square);
        this.data.append(this.container);
        document.body.append(this.data);
    }

    addInfo(title, data) {
        let info;
        switch (data["type"]) {
            case "progress":
                info = document.createElement("label");
                info.setAttribute("class", "textInfo");
                info.innerText = title;

                let value = document.createElement("progress");
                value.setAttribute("class", "progressInfo");

                data["value"] = value;

                info.append(value);
                break;
            
            case "text":
                info = document.createElement("p");
                info.setAttribute("class", "textInfo");
                break;
        }
        data["info"] = info;
                this.container.append(info);

        if (data["object"] instanceof Enemy) {
            this.data.style.setProperty("--progress-background", "#900");
            this.data.style.setProperty("--progress-bar-background", "#f00");
        }

        this.createdInfo[title] = data;

        this.updateInfo(title, data["object"], data["valueName"]);
    }

    removeInfo(title) {
        this.createdInfo[title]["info"].remove();
        delete this.createdInfo[title];
    }

    updateInfo(title) {
        let info = this.createdInfo[title]["info"];
        let progress = this.createdInfo[title]["value"];
        let object = this.createdInfo[title]["object"];
        let value = getValueByPath(object, this.createdInfo[title]["valueName"]);
        let maxValue = getValueByPath(object, this.createdInfo[title]["maxValueName"]); //object[this.createdInfo[title]["maxValueName"]];

        // console.log(this.createdInfo[title]["valueName"], value, object["charge"]);

        switch (this.createdInfo[title]["type"]) {
            case "progress":
                progress.value = value / maxValue;
                break;
            
            case "text":
                info.innerText = `${title}: ${value}`;
                break;
        }
    }
}