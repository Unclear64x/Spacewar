class BaseObject {
    /**@type {HTMLElement} */
    object;
    /**@type {Number} */
    x;
    /**@type {Number} */
    y;
    /**@type {Number} */
    angle = 0;
    /**@type {Animator} */
    animator;
    /**@type {Array<ChildObject>} */
    children = [];
    /**@type {Vector} */
    forward = new Vector(0, 1);
    /**@type {Vector} */
    globalPosition = new Vector(0, 0);

    static #totalId = 0;

    /**@type {Number} */
    id = 0;

    destroyed = false;

    /**
     * 
     * @param {String} uniqueId id
     * @param {Object} animatorParams параметры для аниматора 
     * @param {String} startState начальное состояние аниматора
     * @param {Number} x позиция X
     * @param {Number} y позиция Y
     */
    constructor(uniqueId, animatorParams, startState, x = 0, y = 0) {
        this.id = BaseObject.#totalId++;

        console.log(uniqueId, animatorParams, startState, x, y);

        this.defaultConstructor(uniqueId, animatorParams, startState, x, y);
    }

    /**
     * 
     * @param {String} uniqueId id
     * @param {Object} animatorParams параметры для аниматора 
     * @param {String} startState начальное состояние аниматора
     * @param {Number} x позиция X
     * @param {Number} y позиция Y
     */
    defaultConstructor(uniqueId, animatorParams, startState, x, y) {
        this.object = document.createElement("div");
        this.object.className = "object";
        if (uniqueId)
            this.object.id = uniqueId;

        this.x = x;
        this.y = y;

        if (animatorParams && startState) {
            this.img = document.createElement("img");
            this.img.className = "image";
            this.img.addEventListener('dragstart', (e) => e.preventDefault());
            this.object.append(this.img);

            this.animator = new Animator(animatorParams, this.img, startState);
        }

        World.Space.append(this.object);
        World.Objects[this.id] = this;
    }

    addChild(uniqueId, animatorParams, startState, x = 0, y = 0) {
        let child = new ChildObject(this, uniqueId, animatorParams, startState, x, y);
        this.children.push(child);
        this.object.append(child.object);
        return child;
    }

    update() {
        this.updateGlobalPosition();
        this.forward.set(Math.cos(this.relativeAngle()), Math.sin(this.relativeAngle()));

        this.object.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}rad)`

        Debug.displayLine(`${this.id} forward`, this.globalPosition, this.forward.new().multiply(100).add(this.globalPosition), "purple");

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    }

    updateGlobalPosition() {
        this.globalPosition.set(this.x, this.y);
    }

    relativeAngle() {
        return this.angle;
    }

    clearDebug() {
        Debug.clearId(`${this.id} forward`);
    }

    destroy() {
        if (this.destroyed)
            return;
        this.destroyed = true;

        for (let i = 0; i < this.children; i++) {
            this.children[i].destroy();
        }

        delete World.Objects[this.id];
        this.object.remove();
    }
}

class ChildObject extends BaseObject {
    /**@type {BaseObject} */
    parent;
    /**
     * 
     * @param {BaseObject} parent 
     * @param {String} uniqueId 
     * @param {Object} animatorParams 
     * @param {String} startState 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(parent, uniqueId, animatorParams, startState, x = 0, y = 0) {
        super(uniqueId, animatorParams, startState, x, y);

        this.parent = parent;
    }

    updateGlobalPosition() {
        let sin = Math.sin(this.parent.angle);
        let cos = Math.cos(this.parent.angle);

        let x = this.parent.globalPosition.x + this.x * cos - this.y * sin;
        let y = this.parent.globalPosition.y + this.x * sin + this.y * cos;
        this.globalPosition.set(x, y);
    }

    relativeAngle() {
        return this.parent.angle + this.angle;
    }
}

class DynamicObject extends BaseObject {
    velocity = new Vector(0, 0);
    angularVelocity = 0;
    /**@type {Array<Vector>} */
    collider;
    mass = 1;
    /**@type {Vector} */
    center;
    /**@type {Number} */
    momentInercia;

    velocityMultiplier = 2;

    reduceVelocity = true;
    reduceAngularVelocity = true;
    static reduceFactor = 0.2;
    
    static maxVelocity = 250;
    static maxAngularVelocity = 10;
    
    /**
     * 
     * @param {Array<BaseObject>} objects массив всех объектов
     * @param {Array<Vector>} collider массив точек коллайдера
     * @param {String} uniqueId id
     * @param {Object} animatorParams параметры для аниматора 
     * @param {String} startState начальное состояние аниматора
     * @param {Number} x позиция X
     * @param {Number} y позиция Y
     * @param {Number} mass масса объекта
     */
    constructor(collider, uniqueId, animatorParams, startState, x = 0, y = 0, mass = 1) {
        super(uniqueId, animatorParams, startState, x, y);

        // интересно, кто у кого синтаксис повзаимствовал с ?
        for (let i = 0; i < collider?.length ?? 0; i++) {
            collider[i].multiply(64);
        }

        this.collider = collider;

        let colliderInfo = getColliderInfo(collider, mass);
        this.center = colliderInfo[0];
        this.momentInercia = colliderInfo[1];
        this.mass = mass;

        World.DynamicObjects[this.id] = this;
    }

    /**
     * Возвращает точку столкновения с объектом
     * @param {DynamicObject} object объект
     */
    collide(object) {
        if (lengthBetween(this.x, this.y, object.x, object.y) > MIN_DISTANCE_TO_OBJECT)
            return null;

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

        let collide = this.onCollide(dots[0][0], object) && object.onCollide(dots[0][0], this);
        if (!collide)
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

        this.addVelocity(n1.new().multiply(-j / this.mass), angular);
        object.addVelocity(n1.new().multiply(j / object.mass), objectAngular);
        console.log(n1, j);

        return dots[0];
    }

    /**
     * 
     * @param {Vector} velocity ускорение объекта
     * @param {Number} angularVelocity вращательное ускорение
     */
    _addVelocity(velocity, angularVelocity) {
        let cos = this.velocity.cos(velocity);

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

        this._addVelocity(velocity, angularVelocity, false);
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

        Debug.displayLine(`${this.id} velocity`, this.globalPosition, this.globalPosition.new().add(this.velocity), "white")
        
        super.update();

        this._addVelocity(
            this.reduceVelocity ? this.velocity.new().multiply(-1).normalize() : Vector.ZERO,
            this.reduceAngularVelocity ? -this.angularVelocity / 2 : 0
        );
    }

    /**
     * 
     * @param {Vector} dot
     * @param {DynamicObject} object 
     */
    onCollide(dot, object) {
        return true; // можно было бы собитиями сделать, но с пулями это будет не очень эффективно
    }

    destroy() {
        super.destroy();

        delete World.DynamicObjects[this.id];
    }
}

class DamageableObject extends DynamicObject {
    /**@type {Number} */
    health = 100;

    defaultConstructor(uniqueId, animatorParams, startState, x, y) {
        super.defaultConstructor(uniqueId, animatorParams, startState, x, y);

        World.DamagableObjects[this.id] = this;
    }

    damage(value) {
        this.health -= value;

        if (this.health <= 0) {
            this.destroy();
        }
    }

    update(deltaTime) {
        super.update(deltaTime);

        Debug.displayText(`health${this.id}`, this.globalPosition.new().add2(0, 64), this.health);
    }

    destroy() {
        super.destroy();
        
        delete World.DamagableObjects[this.id];
    }
}