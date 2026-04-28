class Object {
    obj;
    x;
    y;
    width;
    colliders;
    collider;
    animator;

    /**
     * 
     * @param {*} colliders массив всех коллайдеров
     * @param {*} collider массив точек коллайдера
     * @param {*} id id
     * @param {*} animatorParams параметры для аниматора 
     * @param {*} startState начальное состояние аниматора
     * @param {*} x позиция X
     * @param {*} y позиция Y
     */
    constructor(colliders, collider, id, animatorParams, startState, x = 0, y = 0) {
        this.obj = document.createElement("img");

        this.animator = new Animator(animatorParams, this.obj, startState);

        this.x = x;
        this.y = y;

        this.colliders = colliders;

        for (let i = 0; i < collider.length; i++) {
            collider[i] *= this.width;
        }
        this.collider = collider;

        this.obj.id = id;
        this.obj.className = "object";
        this.obj.style.left = x + "px";
        this.obj.style.bottom = y + "px";

        this.width = this.obj.naturalWidth;

        document.body.append(this.obj);
    }
}

class DynamicObject extends Object {
    velocity = [0, 0];
    angularVelocity = 0;
    mass = 10;
    
    static maxVelocity = 10;
    
    constructor(colliders, collider, id, animatorParams, startState, x = 0, y = 0, mass = 10) {
        super(colliders, collider, id, animatorParams, startState, x, y);

        this.mass = mass;
    }

    /**
     * 
     * @param {Object} object 
     */
    collide(object) {
        let dots = [];

        for (let b = 0; b < this.collider.length - 1; b++) {
            let x11 = this.collider[b][0], y11 = this.collider[b][1];
            let x12 = this.collider[b][0], y12 = this.collider[b][1];

            for (let i = 0; i < object.collider.length; i++) {
                let x21 = object.collider[i][0], y21 = object.collider[i][1];
                let x22 = object.collider[i][0], y22 = object.collider[i][1];

                let dot = this.collideDot(x11, y11, x12, y12, x21, y21, x22, y22);
                if (dot != null)
                    dots.push(dot);
            }
        }

        // сортировка по дистанции точки пересечения (от меньшего к большему)
        dots.sort((a, b) => a[2] - b[2]);

        if (dots.length == 0)
            return null;
        else
            return dots[0];
    }

    collideDot(x11, y11, x12, y12, x21, y21, x22, y22) {
        let d = (x22-x21)*(y12-y11) - (x12-x11)*(y22-y21);
        if (d == 0)
            return null;
        let dt = (x22-x21)*(y21-y11) - (x21-x11)*(y22-y21);

        let t = dt / d;
        let x = x11 + (x12-x11) * t;
        let y = y11 + (y12-y11) * t;
        return [x, y, (x**2 + y**2) ** 0.5];
    }

    /**
     * 
     * @param {number} velocity ускорение объекта
     */
    addVelocity(velocity, angularVelocity) {
        this.velocity += velocity;
        angularVelocity = Math.max(this.maxVelocity, this.angularVelocity + angularVelocity);

        let length = (this.velocity[0]**2 + this.velocity[0]**2) ** 0.5;

        if (length > maxVelocity) {
            this.velocity[0] *= maxVelocity / length;
            this.velocity[1] *= maxVelocity / length;
        }
    }

    update(deltaTime) {
        x += this.velocity * deltaTime;
    }
}