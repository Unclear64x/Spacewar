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
    container1;
    /**@type {HTMLElement} */
    container2;

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

        if (!this.visible)
            return;

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

        let info = document.createElement("div");
        info.setAttribute("class", "info");

        let row = document.createElement("div");
        row.setAttribute("class", "infoRow");

        let column = document.createElement("div");
        column.setAttribute("class", "infoColumn");

        this.container1 = document.createElement("div");
        this.container1.setAttribute("class", "infoContainer vertivalMargin");

        this.container2 = document.createElement("div");
        this.container2.setAttribute("class", "infoContainer horizontalMargin");
        this.container2.style.alignSelf = "start";
        this.container2.style.transform = "none";

        let square = document.createElement("div");
        square.setAttribute("class", "squareInfo");
        
        column.append(this.container1);
        row.append(square, this.container2);
        info.append(row, column);
        this.data.append(info);
        World.ObjectDatas.append(this.data);
    }

    addInfo(title, data) {
        // let info = document.createElement("div");
        let first;
        let second;
        switch (data["type"]) {
            case "progress":
                first = document.createElement("label");
                first.innerText = title;

                second = document.createElement("progress");
                second.setAttribute("class", "progressInfo");
                break;

            case "text":
                first = document.createElement("label");
                first.innerText = title;

                second = document.createElement("label");
                break;

            case "icon":
                first = document.createElement("img");
                first.setAttribute("class", "iconInfo");
                first.src = data["icon"];

                second = document.createElement("label");
        }

        // info.setAttribute("class", "info");
        // info.append(first, second);

        // data["info"] = info;
        data["first"] = first;
        data["second"] = second;

        let container = data["container"] ?? 1;

        if (container == 1)
            this.container1.append(first, second);
        else
            this.container2.append(first, second);

        if (data["object"] instanceof Enemy) {
            this.data.style.setProperty("--progress-background", "#900");
            this.data.style.setProperty("--progress-bar-background", "#f00");
        }

        this.createdInfo[title] = data;

        this.updateInfo(title, data["object"], data["valueName"]);
    }

    removeInfo(title) {
        this.createdInfo[title]["first"].remove();
        this.createdInfo[title]["second"].remove();
        delete this.createdInfo[title];
    }

    updateInfo(title) {
        let first = this.createdInfo[title]["first"];
        let second = this.createdInfo[title]["second"];
        let object = this.createdInfo[title]["object"];
        let objectValue = getValueByPath(object, this.createdInfo[title]["valueName"]);
        let objectMaxValue = getValueByPath(object, this.createdInfo[title]["maxValueName"]); //object[this.createdInfo[title]["maxValueName"]];

        // console.log(this.createdInfo[title]["valueName"], value, object["charge"]);

        switch (this.createdInfo[title]["type"]) {
            case "progress":
                second.value = objectValue / objectMaxValue;
                break;

            default: // для text и icon
                second.innerText = objectValue;
                break;
        }
    }
}