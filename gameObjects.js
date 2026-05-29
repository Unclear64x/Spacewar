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

    /**@type {ParticleSystem} */
    particleSystem1;
    /**@type {ParticleSystem} */
    particleSystem2;

    constructor(id, x, y) {
        let collider = [
            new Vector(0.5, 0.5),
            new Vector(0.5, -0.5),
            new Vector(-0.5, -0.5),
            new Vector(-0.5, 0.5),
        ];

        super(collider, id, shipAnimation, "idle", x, y, 40);

        this.gun1 = this.addChild("gun1", gunAnimation, "idle", 0, 32, 30, 10);
        this.gun2 = this.addChild("gun2", gunAnimation, "idle", 0, -32, 30, 10);

        let lifeTime = 0.2;
        let angle = DegToRad(50)
        let color = [0, 128, 255];
        this.particleSystem1 = new ParticleSystem(this.addChild(null, null, null, -35, 10), Vector.ZERO, lifeTime, angle, color);
        this.particleSystem2 = new ParticleSystem(this.addChild(null, null, null, -35, -10), Vector.ZERO, lifeTime, angle, color);

        this.damageParticleSystem.color = [64, 64, 64];
    }

    input(velocity, angularVelocity) {
        this.addVelocity(velocity, angularVelocity);

        if (!this.reduceVelocity)
            this.shotParticles(velocity);

        if (velocity.x == 0 && velocity.y == 0 && this.animator.state != "idle")
            this.animator.setState("idle");
        else if (velocity.x != 0 && velocity.y != 0 && this.animator.state != "move") {
            this.animator.setState("move");
        }
    }

    shotParticles(velocity) {
        this.particleSystem1.setDirection(velocity);
        this.particleSystem2.setDirection(velocity);
        this.particleSystem1.shot();
        this.particleSystem2.shot();
    }

    /**
     * Поворачивает пушки в сторону глобальной точки
     * @param {Vector} dot 
     */
    lookGunAt(dot) {
        let a = dot.new().remove(this.gun1.globalPosition);
        this.gun1.angle = Math.atan2(a.y, a.x) - World.Player.angle;

        let b = dot.new().remove(this.gun2.globalPosition);
        this.gun2.angle = Math.atan2(b.y, b.x) - World.Player.angle;
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
        new Bullet(this, gun.globalPosition.x, gun.globalPosition.y, gun.forward, 10);
        gun.animator.setState("fire", true)
    }
}

class Bullet extends DynamicObject {
    /**@type {HTMLElement} */
    bullet;
    /**@type {Vector} */
    tail;
    /**@type {Number} */
    damage;
    /**@type {DynamicObject} */
    owner

    timer = 0;

    width = 0;

    tracerLength = 150;

    static Speed = 1000;

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Vector} forward 
     * @param {Number} damage 
     */
    constructor(owner, x, y, forward, damage) {
        let collider = [
            new Vector(0, 0),
            new Vector(-0.5, 0)
        ]
        super(collider, null, null, null, x, y);
        
        this.owner = owner;

        // this.bullet = document.createElement("div");
        // this.bullet.className = "bullet";
        // this.object.append(this.bullet);
        this.angle = Math.atan2(forward.y, forward.x);

        this.tail = new Vector(x, y);

        this.damage = damage;

        this.velocity.set2(forward.new().multiply(Bullet.Speed));

        this.reduceVelocity = false;

        this.timer = setTimeout(() => this.destroy(), 1000);
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        let localTail = this.tail.new().remove(this.globalPosition);
        let length = localTail.length();

        if (this.destroyed) 
            this.tracerLength -= deltaTime * Bullet.Speed;
        
        if (this.destroyed || length > 150)
            this.tail.set2(this.globalPosition.new().add(localTail.multiply(this.tracerLength / length)));

        Debug.displayDot(`start ${this.id}`, this.globalPosition, "green");
        Debug.displayDot(`end ${this.id}`, this.tail, "green");

        if (this.destroyed && this.tracerLength <= 1) {
            this.destroyed = false;
            super.destroy();
            return;
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    _renderContent(ctx) {
        ctx.beginPath();
        let length = -this.tail.new().remove(this.globalPosition).length();
        let gradient = ctx.createLinearGradient(0, 0, length, 0);
        gradient.addColorStop(0, "rgba(255,100,0,1)");
        gradient.addColorStop(1, "rgba(128,0,0,0.2)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();
    }

    /**
     * 
     * @param {Array<Vector>} dotInfo
     * @param {DamageableObject} object 
     */
    onCollide(dotInfo, object) {
        let isBullet = object instanceof Bullet;
        let isOwner = object == this.owner;
        let isDamagable = object instanceof DamageableObject;

        if (!isBullet && !isOwner && isDamagable) {
            clearTimeout(this.timer);
            object.damage(this.damage, dotInfo);
            this.destroy();
        }

        return !isBullet && !isOwner && isDamagable;
    }

    _addVelocity(velocity, angularVelocity) {} // чтобы обойти ограничение ускорения

    destroy() {
        this.destroyed = true;
        delete World.DynamicObjects[this.id];
        this.velocity.set(0, 0);
    }

    clearDebug() {
        super.clearDebug();
        Debug.erase(`start ${this.id}`);
        Debug.erase(`end ${this.id}`);
    }
}

class Enemy extends Ship {

}

class Player extends Ship {
    constructor(x, y) {
        super("player", x, y);
    }
}

class Meteorite extends DamageableObject {
    constructor(x, y, material) {
        let collider = [
            new Vector(-0.15625, -0.5),
            new Vector(-0.5, -0.359),
            new Vector(-0.5, 0.3),
            new Vector(0.25, 0.5),
            new Vector(0.5, -0.188),
        ];

        super(collider, null, meteoriteAnimation, "none", x, y, 1000);

        this.health = 10000;

        this.damageParticleSystem.color = [128, 128, 128];

        World.Meteorites[this.id] = this;
    }

    update(deltaTime) {
        super.update(deltaTime);

        let distance = World.Player.globalPosition.new(this.globalPosition).length();

        if (distance > window.innerWidth * 3 || distance > window.innerHeight * 3)
            this.destroy();
    }

    destroy() {
        super.destroy();
        delete World.Meteorites[this.id];
    }
}