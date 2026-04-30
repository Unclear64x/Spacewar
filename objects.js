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
     * @param {Array<Array<Number>>} collider массив точек коллайдера
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
            collider[i][0] *= this.width;
            collider[i][1] *= this.width;
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
    velocity = [0, 0];
    angularVelocity = 0;
    mass = 1;
    center = [0, 0];
    angle = 0;

    reduceVelocity = true;
    reduceAngularVelocity = true;
    static reduceFactor = 0.05;
    
    static maxVelocity = 300;
    static maxAngularVelocity = 10;
    
    /**
     * 
     * @param {Array<BaseObject>} objects массив всех объектов
     * @param {Array<Array<Number>>} collider массив точек коллайдера
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
     * Проверяет, есть ли точка столкновения с объектом
     * @param {Object} object объект
     * @returns null или [x, y] столкновения
     */
    collide(object) {
        let dots = [];
        let len1 = this.collider.length;

        for (let b = 0; b < len; b++) {
            let x11 = this.collider[b][0], y11 = this.collider[b][1];
            let x12 = this.collider[(b + 1) % len1][0], y12 = this.collider[(b + 1) % len1][1];

            let len2 = object.collider.length;
            for (let i = 0; i < len2; i++) {
                let x21 = object.collider[i][0], y21 = object.collider[i][1];
                let x22 = object.collider[(i + 1) % len2][0], y22 = object.collider[(i + 1) % len2][1];

                let dot = this.collideDot(x11, y11, x12, y12, x21, y21, x22, y22);
                if (dot != null)
                    dots.push(dot);
            }
        }

        // сортировка по дистанции точки пересечения (от меньшего к большему)
        dots.sort((a, b) => a[2] - b[2]);

        if (dots.length == 0)
            return null;
        return dots[0];
    }

    /**
     * Вычисляет точку столкновения по двум сторонам
     * @param {Number} x11 
     * @param {Number} y11 
     * @param {Number} x12 
     * @param {Number} y12 
     * @param {Number} x21 
     * @param {Number} y21 
     * @param {Number} x22 
     * @param {Number} y22 
     * @returns null или [x, y, длинна вектора]
     */
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
     * @param {Array<Number>} velocity ускорение объекта
     * @param {Number} angularVelocity вращательное ускорение
     */
    #addVelocity(velocity, angularVelocity) {
        //console.log(velocity);
        //console.log(this.reduceAngularVelocity, angularVelocity);

        let scalar = 0; //getScalarProduct(this.velocity, velocity);

        this.velocity[0] += velocity[0] * (1 + scalar);
        this.velocity[1] += velocity[1] * (1 + scalar);

        this.angularVelocity = Math.min(Math.max(this.angularVelocity + angularVelocity, -DynamicObject.maxAngularVelocity), DynamicObject.maxAngularVelocity);
    }

    /**
     * 
     * @param {Array<Number>} velocity ускорение объекта
     * @param {Number} angularVelocity вращательное ускорение
     */
    addVelocity(velocity, angularVelocity) {
        this.reduceVelocity = !(velocity[0] || velocity[1]);
        this.reduceAngularVelocity = angularVelocity == 0;

        this.#addVelocity(velocity, angularVelocity, false);
    }

    /**
     * 
     * @param {Number} deltaTime время кадра
     */
    update(deltaTime) {
        this.x += this.velocity[0] * deltaTime;
        this.y += this.velocity[1] * deltaTime;

        this.angle += this.angularVelocity * deltaTime;
        
        this.obj.style.left = this.x + "px";
        this.obj.style.top = this.y + "px";

        this.obj.style.transform = `translate(-50%, -50%) rotate(${this.angle}rad)`

        this.#addVelocity(
            this.reduceVelocity ? [-this.velocity[0] / 2, -this.velocity[1] / 2] : [0, 0],
            this.reduceAngularVelocity ? -this.angularVelocity / 2: 0
        );
    }
}