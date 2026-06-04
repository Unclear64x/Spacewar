class ParticleSystem {
    /**@type {BaseObject} */
    object;

    /**@type {Vector} */
    direction = new Vector(0, 0);

    angleRange = 0;
    
    maxParticles = 50;
    randomizeSpeed = false;
    speed = 100;

    static #totalId;
    id;

    totalParticleId;
    particles = {};

    color;

    lifeTime;

    /**
     * 
     * @param {BaseObject} object 
     * @param {Vector} direction 
     * @param {Number} lifeTime 
     * @param {Number} angle 
     */
    constructor(object, direction, lifeTime, angleRange, color = [0, 0, 0]) {
        this.object = object;
        this.setDirection(direction);
        this.lifeTime = lifeTime;
        this.color = color.slice();
        
        this.angleRange = angleRange;

        this.id = ParticleSystem.#totalId++;
        World.ParticleSystems[this.id] = this;
    }

    shot(count = 1) {
        let particles = Object.keys(this.particles);

        for (let i = 0; i < count; i++) {
            if (particles.length >= this.maxParticles) {
                this.particles[particles[0]]?.destroy();
            }

            //console.log("PARTICLE", this.object.globalPosition.x, this.object.globalPosition.y);

            let randomAngle = random(-this.angleRange / 2, this.angleRange / 2) + Math.atan2(-this.direction.y, -this.direction.x);
            let particle = new Particle(this, this.object.globalPosition.x, this.object.globalPosition.y, randomAngle, this.lifeTime, this.color);

            particle.speed = this.speed * (this.randomizeSpeed ? random(0.3, 1) : 1);
        }
    }

    setDirection(direction) {
        if (direction)
            this.direction.set2(direction);
    }

    update(deltaTime) {
        if (this.object.destroyed) {
            this.destroy();
        }
    }

    destroy() {
        // World.delete(World.ParticleSystems, this.id);
        delete World.ParticleSystems[this.id];
    }
}

class Particle extends BaseObject {
    lifeTime = 1;
    time = 1

    system;

    speed = 1;

    sourceColor;
    color;

    constructor(system, x, y, angle, lifeTime, color = [0, 0, 0]) {
        super(null, null, null, x, y);
        
        this.system = system;
        this.angle = angle;
        this.lifeTime = lifeTime;
        this.time = lifeTime;
        this.sourceColor = color;
        this.color = color;

        // this.img = document.createElement("div");
        // this.img.setAttribute("class", "particle");
        // this.object.append(this.img);

        this.system.particles[this.id] = this;

        this.update(0);
    }

    update(deltaTime) {
        super.update();

        this.time -= deltaTime;

        if (this.time <= 0) {
            this.destroy();
            return;
        }

        this.x += this.forward.x * deltaTime * this.speed;
        this.y += this.forward.y * deltaTime * this.speed;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    _renderContent(ctx) {
        let k = this.time / this.lifeTime;
        ctx.fillStyle = `rgba(${this.color[0] * k}, ${this.color[1] * k}, ${this.color[2] * k}, ${k})`;
        ctx.fillRect(-5, -5, 10, 10);
    }

    destroy() {
        super.destroy();
        delete this.system.particles[this.id];
    }
}