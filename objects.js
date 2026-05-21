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
    children = [];

    static #totalId = 0;

    /**@type {Number} */
    id = 0;

    displayedLinesObject;
    displayedLines = {};

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
        this.id = BaseObject.#totalId++;

        this.defaultConstructor(id, animatorParams, startState, x, y);

        this.objects = objects;
        
        for (let i = 0; i < collider.length; i++) {
            collider[i].multiply(64);
        }
        
        this.collider = collider;

        document.getElementById("space").append(this.object);
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

        this.x = x;
        this.y = y;

        if (!animatorParams || !startState)
            return;

        this.img = document.createElement("img");
        this.img.className = "image";
        this.object.append(this.img);

        this.animator = new Animator(animatorParams, this.img, startState);
    }

    addChild(id, animatorParams, startState, x = 0, y = 0) {
        let child = new ChildObject(this, id, animatorParams, startState, x, y);
        this.children.push(child);
        this.object.append(child.object);
        return child;
    }

    /** @returns {Vector} */
    globalPosition() {
        return new Vector(this.x, this.y);
    }

    /**@returns {Number} */
    globalRotation() {
        return this.angle;
    }

    update() {
        //this.object.style.left = this.x + "px";
        //this.object.style.top = this.y + "px";

        this.object.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}rad)`

        Debug.displayLine(`${this.id} forward`, this.globalPosition(), this.globalPosition().add2(100 * Math.cos(this.angle), 100 * Math.sin(this.angle)), "purple");

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update();
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
        super([], [], id, animatorParams, startState, x, y);

        this.parent = parent;
    }

    globalPosition() {
        let sin = Math.sin(this.parent.angle);
        let cos = Math.cos(this.parent.angle);

        let x = this.parent.globalPosition().x + this.x * cos - this.y * sin;
        let y = this.parent.globalPosition().y + this.x * sin + this.y * cos;

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
    /**@type {Vector} */
    center;
    /**@type {Number} */
    momentInercia;

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

        let colliderInfo = getColliderInfo(collider, mass);
        this.center = colliderInfo[0];
        this.momentInercia = colliderInfo[1];
        this.mass = mass;

        console.log(this.x, this.y);
    }

    /**
     * Возвращает точку столкновения с объектом
     * @param {DynamicObject} object объект
     */
    collide(object) {
        let dots = [];
        let len1 = this.collider.length;
        let len2 = object.collider.length;

        for (let b = 0; b < len1; b++) {
            let dot11 = this.collider[b].new().rotate(this.angle).add2(this.x, this.y);
            let dot12 = this.collider[(b + 1) % len1].new().rotate(this.angle).add2(this.x, this.y);
            Debug.displayLine(`${this.id} ${b}`, dot11, dot12, "red");

            for (let i = 0; i < len2; i++) {
                let dot21 = object.collider[i].new().rotate(object.angle).add2(object.x, object.y);
                let dot22 = object.collider[(i + 1) % len2].new().rotate(object.angle).add2(object.x, object.y);
                Debug.displayLine(`${object.id} ${i}`, dot21, dot22, "red");

                let dot = findDot(dot11, dot12, dot21, dot22);
                if (dot != null) {
                    let n1 = new Vector(dot12.x - dot.x, dot12.y - dot.y).perpend().add(dot);
                    let n2 = new Vector(dot22.x - dot.x, dot22.y - dot.y).perpend().add(dot);
                    dots.push([dot, n1, n2]);
                }
            }
        }

        // сортировка по дистанции точки пересечения (от меньшего к большему)
        dots.sort((a, b) => a[0].length() - b[0].length());

        if (dots.length == 0)
            return null;

        Debug.displayDot("collideDot", dots[0][0], "blue");
        Debug.displayLine("normal1", dots[0][0], dots[0][1], "orange");
        Debug.displayLine("normal2", dots[0][0], dots[0][2], "aqua");

        let dot = dots[0][0];
        let n1 = dots[0][1].remove(dot).normalize();
        let n2 = dots[0][2].remove(dot).normalize();
        let n = n1.new().multiply(40).add(n2.multiply(40)).add(dot);

        Debug.displayLine("n", dot, n, "lime");


        let globalCenter = this.center.new().rotate(this.angle).add2(this.x, this.y);
        let globalObjectCenter = object.center.new().rotate(object.angle).add2(object.x, object.y);

        let radiusVectorCenterToDot = dot.new().remove(globalCenter);
        let objectRadiusVectorCenterToDot = dot.new().remove(globalObjectCenter);

        let F = this.velocity.new().remove(object.velocity);
        let angular = radiusVectorCenterToDot.cross(F) / this.mass;
        let objectAngular = objectRadiusVectorCenterToDot.cross(F) / object.mass;

        let j = 2 * this.velocity.new().remove(object.velocity).scalar(n1.normalize()) / ((1 / this.mass) + (1 / object.mass)); 

        // let vel = this.velocity.new().remove(dot.new().remove(object.globalPosition()));
        // this.addVelocity(object.velocity.new().remove(dot.new().remove(this.globalPosition())), angular);
        // object.addVelocity(vel, objectAngular);

        this.addVelocity(n1.new().multiply(-j / this.mass), angular);
        object.addVelocity(n1.new().multiply(j / object.mass), objectAngular);
        console.log(n1, j);

        // ненавижу физику

        // let globalCenter = this.center.new().rotate(this.angle).add2(this.x, this.y);
        // let globalObjectCenter = object.center.new().rotate(object.angle).add2(object.x, object.y);

        // let radiusVectorCenterToDot = dot.new().remove(globalCenter);
        // let objectRadiusVectorCenterToDot = dot.new().remove(globalObjectCenter);

        // let relativeVelocity = this.velocity.new().remove(object);
        // let moveAngle = relativeVelocity.scalar(n);
        
        // let partOfMass = 1 / this.mass;
        // let objectPartOfMass = 1 / object.mass;

        // let partOfInercia = 1 / this.momentInercia;
        // let objectPartOfInercia = 1 / object.momentInercia;

        // let moveVector = radiusVectorCenterToDot.cross(n);
        // let objectMoveVector = objectRadiusVectorCenterToDot.cross(n);

        // let d = partOfMass + objectPartOfMass + (moveVector ** 2) * partOfInercia + (objectMoveVector ** 2) * objectPartOfInercia;

        // if (d == 0)
        //     return;

        // let uprugost = 0.5;
        // let impulse = n.multiply(-(1 + uprugost) * moveAngle / d);

        // let deltaMomentOfInercia = radiusVectorCenterToDot.cross(impulse);
        // let objectDeltaMomentOfInercia = objectRadiusVectorCenterToDot.cross(impulse);

        // Debug.displayLine(`${this.id} imp`, this.globalPosition(), impulse.new().add(this.globalPosition()), "yellow");
        // Debug.displayLine(`${object.id} imp`, object.globalPosition(), impulse.new().multiply(-1).add(object.globalPosition()), "yellow");

        // this.addVelocity(impulse, deltaMomentOfInercia);
        // object.addVelocity(impulse.new().multiply(-1), objectDeltaMomentOfInercia);

        return dots[0];
    }

    /**
     * 
     * @param {DynamicObject} object 
     * @param {Vector} dot 
     * @param {Vector} n1 
     * @param {Vector} n2 
     */
    calculateCollision(object, dot, n1, n2) {
        let n = n1.new().add(n2).normalize();
        if (n.length() == 0)
            return;

        let cA = this.center.new().rotate(this.angle).add2(this.x, this.y);
        let cB = object.center.new().rotate(object.angle).add2(object.x, object.y);

        let rA = dot.new().remove(cA);
        let rB = dot.new().remove(cB);

        let vA = this.velocity.new().add(rA.new().perpend().multiply(this.angularVelocity));
        let vB = object.velocity.new().add(rB.new().perpend().multiply(object.angularVelocity));

        let vRel = vA.remove(vB);
        let vrn = vRel.scalar(n);

        let invMassA = 1 / this.mass;
        let invMassB = 1 / object.mass;

        let invIA = 1 / this.momentInercia;
        let invIB = 1 / object.momentInercia;

        let rAxn = rA.cross(n);
        let rBxn = rB.cross(n);

        let denom = invMassA + invMassB + (rAxn ** 2) * invIA + (rBxn ** 2) * invIB;
        if (denom == 0)
            return;

        let e = 1;

        let j = -(1 + e) * vrn / denom;
        let impulse = n.new().multiply(j);

        console.log(invMassA, invMassB, j);

        this.velocity.multiply(0);
        object.velocity.multiply(0);
        this.addVelocity(impulse.new().multiply(invMassA), rA.cross(impulse) + invIA);
        object.addVelocity(impulse.new().multiply(-invMassB), rB.cross(impulse) + invIB);
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

        Debug.displayLine(`${this.id} velocity`, this.globalPosition(), this.globalPosition().add(this.velocity), "white")
        
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