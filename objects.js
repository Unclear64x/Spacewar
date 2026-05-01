class BaseObject {
    obj;
    x;
    y;
    width;
    objects;
    collider;
    animator;

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
        this.obj = document.createElement("img");

        this.animator = new Animator(animatorParams, this.obj, startState);
        this.width = this.obj.naturalWidth;

        this.x = x;
        this.y = y;

        this.objects = objects;

        for (let i = 0; i < collider.length; i++) {
            collider[i].multiply(this.width);
        }
        this.collider = collider;

        this.obj.id = id;
        this.obj.className = "object";
        this.obj.style.left = x + "px";
        this.obj.style.top = y + "px";

        document.getElementById("space").append(this.obj);
    }
}

class DynamicObject extends BaseObject {
    velocity = new Vector(0, 0);
    angle = 0;
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

        for (let b = 0; b < len1; b++) {
            let dot11 = this.collider[b];
            let dot12 = this.collider[(b + 1) % len1];

            let len2 = object.collider.length;
            for (let i = 0; i < len2; i++) {
                let dot21 = object.collider[i];
                let dot22 = object.collider[(i + 1) % len2];

                let dot = this.collideDot(dot11, dot12, dot21, dot22);
                if (dot != null)
                    dots.push(dot);
            }
        }

        // сортировка по дистанции точки пересечения (от меньшего к большему)
        dots.sort((a, b) => a.length() - b.length());

        if (dots.length == 0)
            return null;
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

        if (d == 0)
            return null;

        let dt = (dot22.x - dot21.x) * (dot21.y - dot11.y) - (dot21.x - dot11.x) * (dot22.y - dot21.y);

        let t = dt / d;
        let x = dot11.x + (dot12.x-dot11.x) * t;
        let y = dot11.y + (dot12.y-dot11.y) * t;
        return new Vector(x, y);
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
        
        this.obj.style.left = this.x + "px";
        this.obj.style.top = this.y + "px";

        this.obj.style.transform = `translate(-50%, -50%) rotate(${this.angle}rad)`

        this.#addVelocity(
            this.reduceVelocity ? new Vector(-this.velocity.x, -this.velocity.y).normalize() : Vector.ZERO,
            this.reduceAngularVelocity ? -this.angularVelocity / 2 : 0
        );
    }
}