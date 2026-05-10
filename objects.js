class BaseObject {
    /**@type {HTMLElement} */
    object;
    /**@type {Number} */
    x;
    /**@type {Number} */
    y;
    /**@type {Number} */
    angle = 0;
    /**@type {Array<BaseObject>} */
    objects;
    /**@type {Array<Vector>} */
    collider = null;
    /**@type {Animator} */
    animator;
    /**@type {Array<ChildObject>} */
    childs = [];


    displayedCollider;
    displayedColliderPoligons = [];

    /**
     * 
     * @param {Array<BaseObject>} objects массив всех объектов
     * @param {Array<Vector>} collider массив точек коллайдера
     * @param {String} id id
     * @param {Object} animatorParams параметры для аниматора 
     * @param {String} startState начальное состояние аниматора
     * @param {Number} x позиция X
     * @param {Number} y позиция Y
     */
    constructor(objects, collider, id, animatorParams, startState, x = 0, y = 0) {
        this.defaultConstructor(id, animatorParams, startState, x, y);

        this.objects = objects;
        
        for (let i = 0; i < collider.length; i++) {
            collider[i].multiply(64);
        }
        
        this.collider = collider;

        document.getElementById("space").append(this.object);
    }

    displayCollider(i, d1, d2) {
        if (this.collider == null)
            return;

        if (!this.displayedCollider) {
            this.displayedCollider = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            this.displayedCollider.setAttribute("class", "debugLine");
            document.getElementById("space").append(this.displayedCollider);
        }

        if (!this.displayedColliderPoligons[i]) {
            let polyLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            polyLine.setAttribute("fill", "none");
            polyLine.setAttribute("stroke", "red");
            polyLine.setAttribute("stroke-width", "2");
            this.displayedCollider.append(polyLine);
            this.displayedColliderPoligons[i] = polyLine;
        }

        this.displayedColliderPoligons[i].setAttribute("points", `${d1.x},${d1.y} ${d2.x},${d2.y}`);

        // let polygons = "";
        // for (let i = 0; i < this.collider.length + 1; i++) {
        //     let index = i % this.collider.length;
        //     polygons += `${this.collider[index].x + 32},${this.collider[index].y + 32} `;
        // }

        // let displayCollider = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        // displayCollider.setAttribute("class", "debugLine");
        // displayCollider.setAttribute("width", "200000");
        // displayCollider.setAttribute("height", "200000");
        
        

        // displayCollider.append(polyLine);
        // document.getElementById("space").append(displayCollider);
    }

    /**
     * 
     * @param {String} id id
     * @param {Object} animatorParams параметры для аниматора 
     * @param {String} startState начальное состояние аниматора
     * @param {Number} x позиция X
     * @param {Number} y позиция Y
     */
    defaultConstructor(id, animatorParams, startState, x, y) {
        this.object = document.createElement("div");
        this.object.id = id;
        this.object.className = "object";

        this.img = document.createElement("img");
        this.img.className = "image";
        this.object.append(this.img);

        this.animator = new Animator(animatorParams, this.img, startState);

        this.x = x;
        this.y = y;
    }

    addChild(id, animatorParams, startState, x = 0, y = 0) {
        let child = new ChildObject(this, id, animatorParams, startState, x, y);
        this.childs.push(child);
        this.object.append(child.object);
    }

    globalPosition() {
        return new Vector(this.x, this.y);
    }

    globalRotation() {
        return this.angle;
    }

    update() {
        //this.object.style.left = this.x + "px";
        //this.object.style.top = this.y + "px";

        this.object.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}rad)`

        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].update();
        }
    }
}

class ChildObject extends BaseObject {
    /**@type {BaseObject} */
    parent;
    /**
     * 
     * @param {BaseObject} parent 
     * @param {String} id 
     * @param {Object} animatorParams 
     * @param {String} startState 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(parent, id, animatorParams, startState, x = 0, y = 0) {
        this.parent = parent;

        this.defaultConstructor(id, animatorParams, startState, x, y);
    }

    globalPosition() {
        let sin = Math.sin(this.parent.angle);
        let cos = Math.cos(this.parent.angle);

        let x = this.parent.globalPosition() + this.x * cos - this.y * sin;
        let y = this.parent.globalPosition() + this.x * sin + this.y * cos;

        return new Vector(x, y);
    }

    globalRotation() {
        return this.parent.globalRotation() + this.angle;
    }
}

class DynamicObject extends BaseObject {
    velocity = new Vector(0, 0);
    angularVelocity = 0;
    mass = 1;
    center;

    velocityMultiplier = 2;

    reduceVelocity = true;
    reduceAngularVelocity = true;
    static reduceFactor = 0.05;
    
    static maxVelocity = 300;
    static maxAngularVelocity = 10;
    
    /**
     * 
     * @param {Array<BaseObject>} objects массив всех объектов
     * @param {Array<Vector>} collider массив точек коллайдера
     * @param {String} id id
     * @param {Object} animatorParams параметры для аниматора 
     * @param {String} startState начальное состояние аниматора
     * @param {Number} x позиция X
     * @param {Number} y позиция Y
     * @param {Number} mass масса объекта
     */
    constructor(objects, collider, id, animatorParams, startState, x = 0, y = 0, mass = 1) {
        super(objects, collider, id, animatorParams, startState, x, y);

        //this.displayCollider();

        objects.push(this);

        this.center = getCentreOfMass(collider);
        this.mass = mass;

        console.log(this.x, this.y);
    }

    /**
     * Возвращает точку столкновения с объектом
     * @param {BaseObject} object объект
     */
    collide(object) {
        let dots = [];
        let len1 = this.collider.length;
        let len2 = object.collider.length;

        for (let b = 0; b < len1; b++) {
            let dot11 = this.collider[b].new().rotate(this.angle).add2(this.x, this.y);
            let dot12 = this.collider[(b + 1) % len1].new().rotate(this.angle).add2(this.x, this.y);
            this.displayCollider(b, dot11, dot12);

            for (let i = 0; i < len2; i++) {
                let dot21 = object.collider[i].new().rotate(object.angle).add2(object.x, object.y);
                let dot22 = object.collider[(i + 1) % len2].new().rotate(object.angle).add2(object.x, object.y);
                object.displayCollider(i, dot21, dot22);

                let dot = this.collideDot(dot11, dot12, dot21, dot22);
                if (dot != null) {
                    let n1 = new Vector(dot12.y - dot11.y, -(dot12.x - dot11.x));
                    let n2 = new Vector(dot22.y - dot21.y, -(dot22.x - dot21.x));
                    dots.push([dot, n1, n2]);
                }
            }
        }

        // сортировка по дистанции точки пересечения (от меньшего к большему)
        dots.sort((a, b) => a[0].length() - b[0].length());

        if (dots.length == 0)
            return null;

        let dot = dots[0][0];

        // let r1 = dot.remove(this.center);
        // let r2 = dot.remove(object.center);

        // let v1 = new Vector(this.velocity.x - this.angularVelocity * r1.y, this.velocity.y + this.angularVelocity * r1.x);
        // let v2 = new Vector(object.velocity.x - object.angularVelocity * r2.y, object.velocity.y + object.angularVelocity * r2.x);
        // let u = v1.remove(v2);

        // let n1 = dots[0][1];
        // let n2 = dots[0][2];

        // let un = u.cross(n1);
        //let i = -un / (1 / this.mass + 1 / object.mass + )

        console.log(dot.x, dot.y);
        return dots[0];
    }

    /**
     * Возвращает точку столкновения по двум сторонам
     * @param {Vector} dot11 
     * @param {Vector} dot12 
     * @param {Vector} dot21 
     * @param {Vector} dot22 
     */
    collideDot(dot11, dot12, dot21, dot22) {
        let d = (dot22.x - dot21.x) * (dot12.y - dot11.y) - (dot12.x - dot11.x) * (dot22.y - dot21.y);

        if (Math.abs(d) < 0.0001)
            return null;

        let dt = (dot22.x - dot21.x) * (dot21.y - dot11.y) - (dot21.x - dot11.x) * (dot22.y - dot21.y);
        let du = (dot12.x - dot11.x) * (dot21.y - dot11.y) - (dot12.y - dot11.y) * (dot21.x - dot11.x);

        let t = dt / d;
        let u = du / d;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            let x = dot11.x + (dot12.x - dot11.x) * t;
            let y = dot11.y + (dot12.y - dot11.y) * t;
            return new Vector(x, y);
        }

        return null;
    }

    /**
     * 
     * @param {Vector} velocity ускорение объекта
     * @param {Number} angularVelocity вращательное ускорение
     */
    #addVelocity(velocity, angularVelocity) {
        //console.log(velocity);
        //console.log(this.reduceAngularVelocity, angularVelocity);

        let cos = this.velocity.cos(velocity);

        //console.log(this.reduceVelocity, cos < 0 ? (1 - cos) : 1)

        this.velocity.add(velocity.multiply(cos < 0 ? (1 - cos) : 1));

        if (this.velocity.length() > DynamicObject.maxVelocity) {
            this.velocity.normalize().multiply(DynamicObject.maxVelocity);
        }

        this.angularVelocity = Math.min(Math.max(this.angularVelocity + angularVelocity, -DynamicObject.maxAngularVelocity), DynamicObject.maxAngularVelocity);
    }

    /**
     * 
     * @param {Vector} velocity ускорение объекта
     * @param {Number} angularVelocity вращательное ускорение
     */
    addVelocity(velocity, angularVelocity) {
        this.reduceVelocity = !(velocity.x || velocity.y);
        this.reduceAngularVelocity = angularVelocity == 0;

        this.#addVelocity(velocity, angularVelocity, false);
    }

    /**
     * 
     * @param {Number} deltaTime время кадра
     */
    update(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        this.angle += this.angularVelocity * deltaTime;

        if (this.angle > Math.PI * 2)
            this.angle -= Math.PI * 2;
        else if (this.angle < 0)
            this.angle += Math.PI * 2;
        
        super.update();

        this.#addVelocity(
            this.reduceVelocity ? new Vector(-this.velocity.x, -this.velocity.y).normalize() : Vector.ZERO,
            this.reduceAngularVelocity ? -this.angularVelocity / 2 : 0
        );
    }
}

class DamageableObject extends DynamicObject {
    /**@type {Number} */
    health = 100;

    damage(value) {
        health -= value;

        if (health <= 0)
            document.getElementById("space").removeChild(this.object);
    }
}