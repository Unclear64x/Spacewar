class Ship extends DamageableObject {
    /**@type {ChildObject} */
    gun1;
    /**@type {ChildObject} */
    gun2;

    /**@type {Number} */
    gun1Timer;
    /**@type {Number} */
    gun2Timer;

    /**@type {ParticleSystem} */
    particleSystem1;
    /**@type {ParticleSystem} */
    particleSystem2;

    /**@type {ShipParameters} */
    shipParameters;

    boost = 3;
    charge = 1;
    recharge = 0.2;
    
    damage = 10;
    fireRate = 2;

    
    static MoveColor = [0, 128, 255];
    static BoostColor = [255, 128, 0];

    /**
     * 
     * @param {string} id 
     * @param {Number} x 
     * @param {Number} y 
     * @param {ShipParameters} shipParameters 
     */
    constructor(id, x, y, shipParameters) {
        let collider = [
            new Vector(-0.5, 0.5),
            new Vector(0, 0.5),
            new Vector(0.5, 0.2),
            new Vector(0.5, -0.2),
            new Vector(0, -0.5),
            new Vector(-0.5, -0.5)
            // new Vector(0.5, 0.5),
            // new Vector(0.5, -0.5),
            // new Vector(-0.5, -0.5),
            // new Vector(-0.5, 0.5),
        ];

        super(collider, id, shipAnimation, "idle", x, y, 40);

        this.maxVelocity = shipParameters.maxVelocity;
        this.tickVelocity = shipParameters.tickVelocity;

        this.boost = shipParameters.boost;
        this.charge = shipParameters.charge;
        this.recharge = shipParameters.recharge;
        this.fullRecharge = false;

        this.damage = shipParameters.damage;
        this.fireRate = shipParameters.fireRate;

        this.health = shipParameters.health;

        this.shipParameters = shipParameters;


        this.gun1 = this.addChild("gun1", gunAnimation, "idle", 0, 32, 30, 10);
        this.gun2 = this.addChild("gun2", gunAnimation, "idle", 0, -32, 30, 10);

        let lifeTime = 0.2;
        let angle = degToRad(50);
        this.particleSystem1 = new ParticleSystem(this.addChild(null, null, null, -35, 10), Vector.ZERO, lifeTime, angle, Ship.MoveColor);
        this.particleSystem2 = new ParticleSystem(this.addChild(null, null, null, -35, -10), Vector.ZERO, lifeTime, angle, Ship.MoveColor);

        this.damageParticleSystem.color = [64, 64, 64];
    }

    input(direction, angularVelocity, deltaTime, boost = false) {
        boost = this.charge > 0 && boost && !this.fullRecharge;
        
        let velocity = this.tickVelocity + boost? this.boost : 0;
        this.addVelocity(direction.new().multiply(velocity), angularVelocity);

        this.particleSystem1.speed = this.velocity.length() / 10 + velocity / 3 * 100;
        this.particleSystem2.speed = this.particleSystem1.speed;

        if (boost && (direction.x || direction.y)) {
            this.chargeTimer = 0;
            this.charge = Math.max(0, this.charge - deltaTime);
            this.maxVelocity = this.shipParameters.maxVelocity * this.boost / 2;
            this.particleSystem1.color = Ship.BoostColor;
            this.particleSystem2.color = Ship.BoostColor;
            
        }
        else {
            this.maxVelocity = lerp(this.maxVelocity, this.shipParameters.maxVelocity, 0.01);
            if (this.charge - deltaTime <= this.shipParameters.charge / 2 && !this.fullRecharge)
                this.fullRecharge = true;
            this.particleSystem1.color = Ship.MoveColor;
            this.particleSystem2.color = Ship.MoveColor;
        }

        if (!this.reduceVelocity) {
            this.#shotParticles(direction);
        }

        if (direction.x == 0 && direction.y == 0 && this.animator.state != "idle") {
            this.animator.setState("idle");
        }
        else if (direction.x != 0 && direction.y != 0 && this.animator.state != "move") {
            this.animator.setState("move");
        }
    }

    update(deltaTime) {
        super.update(deltaTime);

        Debug.displayText(`${this.id} charge`, this.globalPosition.new().add2(0, Math.max(this.height, this.width) + 2 + 28), "charge: " + this.charge);
        
        this.chargeTimer = Math.min(this.chargeTimer + deltaTime, 1);
        if (this.chargeTimer > 0.5 && this.charge < this.shipParameters.charge) {
            this.charge = Math.min(this.charge + this.recharge * deltaTime, this.shipParameters.charge);
        }
        if (this.charge == this.shipParameters.charge)
            this.fullRecharge = false;
    }

    #shotParticles(direction) {
        this.particleSystem1.setDirection(direction);
        this.particleSystem2.setDirection(direction);
        this.particleSystem1.shot(5);
        this.particleSystem2.shot(5);
    }

    /**
     * Поворачивает пушки в сторону глобальной точки
     * @param {Vector} dot 
     */
    lookGunAt(dot) {
        let a = dot.new().remove(this.gun1.globalPosition);
        this.gun1.angle = Math.atan2(a.y, a.x) - this.angle;

        let b = dot.new().remove(this.gun2.globalPosition);
        this.gun2.angle = Math.atan2(b.y, b.x) - this.angle;
    }

    fire() {
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
        new Bullet(this, gun.globalPosition.x, gun.globalPosition.y, gun.forward, this.damage);
        gun.animator.setState("fire", true);
    }

    clearDebug() {
        super.clearDebug();
        Debug.erase(`${this.id} charge`);
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

        this.timer = setTimeout(() => this.destroy(), 2000);

        this.update(0);
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        let localTail = this.tail.new().remove(this.globalPosition);
        let length = localTail.length();

        if (this.destroyed) 
            this.tracerLength -= deltaTime * Bullet.Speed;
        
        if (this.destroyed || length > 150)
            this.tail.set2(this.globalPosition.new().add(localTail.multiply(this.tracerLength / (length ? length : 1))));

        Debug.displayDot(`${this.id} start`, this.globalPosition, "green");
        Debug.displayDot(`${this.id} end`, this.tail, "green");

        if (this.destroyed && this.tracerLength <= 1) {
            this.destroyed = false;
            super.destroy();
            return;
        }
    }

    proximityFilter(object) {
        return !(object instanceof Bullet);
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
            object.dealDamage(this.damage, dotInfo, this.owner);
            this.destroy();
        }

        return !isBullet && !isOwner && isDamagable;
    }

    _addVelocity(velocity, angularVelocity) {} // чтобы обойти ограничение ускорения

    destroy() {
        this.destroyed = true;
        //World.delete(World.DamagableObjects, this.id);
        delete World.DynamicObjects[this.id];
        this.velocity.set(0, 0);
    }

    clearDebug() {
        super.clearDebug();
        Debug.erase(`${this.id} start`);
        Debug.erase(`${this.id} end`);
    }
}

class Enemy extends Ship {
    useBoost = false;

    constructor(x, y, shipParameters) {
        super("player", x, y, shipParameters);

        World.Enemies[this.id] = this;

        let data = {
            "Состояние": {
                "type": "progress",
                "object": this,
                "valueName": ["health"],
                "maxValueName": ["shipParameters", "health"]
            },
        }
        
        this.data = new GameObjectData(this.globalPosition, data);
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (!World.AI || World.Player.destroyed)
            return;

        let vectorToPlayer = World.Player.globalPosition.new().remove(this.globalPosition);

        Debug.displayLine(`${this.id} vectorToPlayer`, this.globalPosition, vectorToPlayer.new().add(this.globalPosition), "red");

        let tan = Math.atan2(vectorToPlayer.y, vectorToPlayer.x)
        let angle = tan - this.angle;

        if (angle < -Math.PI) angle += Math.PI * 2;
        if (angle > Math.PI) angle -= Math.PI * 2;

        let velocity = new Vector(0, 0);
        let angleVelocity = (angle - this.angularVelocity / 10);;

        if (vectorToPlayer.length() >= MIN_DISTANCE_TO_OBJECT * 6) {
            velocity.set2(vectorToPlayer.new().normalize());
        }

        if (this.shipParameters.charge == this.charge) {
            this.useBoost = true
        }
        else if (this.charge <= 0.25) {
            this.useBoost = false;
        }

        this.input(velocity, angleVelocity, deltaTime, this.useBoost);
        this.lookGunAt(World.Player.globalPosition);
        if (vectorToPlayer.length() <= MIN_DISTANCE_TO_OBJECT * 12) {
            this.fire();
        }
    }

    destroy() {
        super.destroy();
        // World.delete(World.Enemies, this.id);
        delete World.Enemies[this.id];
    }

    clearDebug() {
        super.clearDebug();
        Debug.erase(`${this.id} vectorToPlayer`);
    }
}

class Player extends Ship {
    constructor(x, y, shipParameters) {
        super("player", x, y, shipParameters);

        let data = {
            "Состояние": {
                "type": "progress",
                "object": this,
                "valueName": ["health"],
                "maxValueName": ["shipParameters", "health"]
            },
            "Заряд": {
                "type": "progress",
                "object": this,
                "valueName": ["charge"],
                "maxValueName": ["shipParameters", "charge"]
            },
            "Метал": {
                "container": 2,
                "type": "icon",
                "icon": materials["metal"].src,
                "object": PlayerInfo.Inventory,
                "valueName": ["metal"]
            },
            "Ирит": {
                "container": 2,
                "type": "icon",
                "icon": materials["irit"].src,
                "object": PlayerInfo.Inventory,
                "valueName": ["irit"]
            },
            "Борит": {
                "container": 2,
                "type": "icon",
                "icon": materials["borit"].src,
                "object": PlayerInfo.Inventory,
                "valueName": ["borit"]
            },
            "Анеит": {
                "container": 2,
                "type": "icon",
                "icon": materials["aneit"].src,
                "object": PlayerInfo.Inventory,
                "valueName": ["aneit"]
            },
        }
        
        this.data = new GameObjectData(this.globalPosition, data);
        this.data.scanTime = 0.5;
    }

    destroy() {
        super.destroy();
        endGame();
    }
}

class Meteorite extends DamageableObject {
    maxHealth = 100;

    renderMaterial;
    material = {"name": "", "count": 0};

    materialImage;

    constructor(x, y) {
        let collider = [
            new Vector(-0.15625, -0.5),
            new Vector(-0.5, -0.359),
            new Vector(-0.5, 0.3),
            new Vector(0.25, 0.5),
            new Vector(0.5, -0.188),
        ];

        super(collider, null, meteoriteAnimation, "none", x, y, 1000);

        this.damageParticleSystem.color = [128, 128, 128];

        World.Meteorites[this.id] = this;

        this.material["name"] = ["metal", "irit", "", "borit", "aneit"][randomInt(0, 4)];
        this.material["count"] = randomInt(1, 10);

        let data = {
            "Состояние": {
                "type": "progress",
                "object": this,
                "valueName": ["health"],
                "maxValueName": ["maxHealth"]
            },
        }

        if (this.material["name"]) {
            // console.log(this.id, this.material["name"]);

            data[materialNames[this.material["name"]]] = {
                "type": "text",
                "object": this,
                "valueName": ["material", "count"],
            }

            this.materialImage = meteoriteMaterials[this.material["name"]];
        }
        
        this.data = new GameObjectData(this.globalPosition, data);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    _renderContent(ctx) {
        super._renderContent(ctx);
        if (!this.materialImage)
            return;
        ctx.drawImage(this.materialImage, -this.width / 2, -this.height / 2, this.width, this.height);
    }

    update(deltaTime) {
        super.update(deltaTime);

        let distance = World.Player.globalPosition.new().remove(this.globalPosition).length();

        if (distance > GameManager.DistanceFromPlayer * 2)
            this.destroy();
    }

    destroy(who) {
        World.Meteorites[this.id] = this;
        super.destroy();
        // World.delete(World.Meteorites, this.id);
        delete World.Meteorites[this.id];

        if (who && who instanceof Player) {
            PlayerInfo.Inventory[this.material["name"]] += this.material["count"];
        }
    }
}