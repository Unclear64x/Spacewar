class Ship extends DamageableObject {
    /**@type {ChildObject} */
    gun1;
    /**@type {ChildObject} */
    gun2;
    
    /**@type {Number} выстрелы в секунду */
    fireRate = 2;
    /**@type {Number} */
    gun1Timer;
    /**@type {Number} */
    gun2Timer;

    constructor(id, x, y) {
        let collider = [
            new Vector(0.5, 0.5),
            new Vector(0.5, -0.5),
            new Vector(-0.5, -0.5),
            new Vector(-0.5, 0.5),
        ];

        super(collider, id, shipAnimation, "idle", x, y, 40);

        this.gun1 = this.addChild("gun1", gunAnimation, "idle", 0, 20);
        this.gun2 = this.addChild("gun2", gunAnimation, "idle", 0, -20);
    }

    input(velocity, angularVelocity) {
        this.addVelocity(velocity, angularVelocity);

        if (velocity.x == 0 && velocity.y == 0 && this.animator.state != "idle")
            this.animator.setState("idle");
        else if (velocity.x != 0 && velocity.y != 0 && this.animator.state != "move")
            this.animator.setState("move");
    }

    /**
     * Поворачивает пушки в сторону глобальной точки
     * @param {Vector} dot 
     */
    lookGunAt(dot) {
        let a = dot.new().remove(this.gun1.globalPosition);
        this.gun1.angle = Math.atan2(a.y, a.x);

        let b = dot.new().remove(this.gun2.globalPosition);
        this.gun2.angle = Math.atan2(b.y, b.x);
    }

    fire() {
        console.log("req");
        if (!this.gun1Timer) {
            this.gun1Timer = setTimeout(() => {this.gun1Timer = 0;}, 1000 / this.fireRate);
            this.#fire(this.gun1);
        }

        if (!this.gun2Timer) {
            this.gun2Timer = setTimeout(() => {this.gun2Timer = 0;}, 1000 / this.fireRate);
            this.#fire(this.gun2);
        }
    }

    /**
     * 
     * @param {ChildObject} gun 
     */
    #fire(gun) {
        console.log("fire!");
    }
}

class Bullet extends BaseObject {
    /**@type {HTMLElement} */
    bullet;
    /**@type {Vector} */
    start

    constructor(x, y, forward) {
        super(null, null, null, x, y);
        
        this.bullet = document.createElement("div");
        this.bullet.className = "bullet";
        this.angle = Math.atan(forward.y, forward.x);

        this.start = new Vector(x, y);
    }

    update() {
        super.update();
        
    }
}

class Player extends Ship {
    constructor(x, y) {
        super("player", x, y);
    }
}

class Meteorite extends DamageableObject {
    constructor(x, y) {
        let collider = [
            new Vector(-0.15625, -0.5),
            new Vector(-0.5, -0.359),
            new Vector(-0.5, 0.3),
            new Vector(0.25, 0.5),
            new Vector(0.5, -0.188),
        ];

        super(collider, null, meteoriteAnimation, "none", x, y, 1000);
    }
}