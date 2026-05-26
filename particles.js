class ParticleSystem {
    /**@type {BaseObject} */
    object;

    /**@type {Vector} */
    direction = new Vector(0, 0);

    static #totalId;
    id;

    totalParticleId;
    particles = {};

    constructor(object, direction, lifeTime) {
        this.object = object;
        this.setDirection(direction);

        this.id = ParticleSystem.#totalId++;
        World.ParticleSystems[this.id] = this;
    }

    shot() {
        let particles = Object.keys(this.particles);
        if (particles.length >= 50) {
            this.particles[particles[0]].destroy();
        }

        new Particle(this, this.object.globalPosition.x, this.object.globalPosition.y, this.direction, 6);
    }

    setDirection(direction) {
        if (direction)
            this.direction.set2(direction);
    }

    update(deltaTime) {
        if (!object) {
            this.destroy();
            return;
        }

        for (let i in this.particles) {
            this.particles[i].update();
        }
    }

    destroy() {
        delete World.ParticleSystems[this.id];
    }
}

class Particle extends BaseObject {
    fade = 0;
    fadeProcess = 1;

    system;

    constructor(system, x, y, direction, fade) {
        super(null, null, null, x, y);
        
        this.system = system;
        this.angle = Math.atan2(-direction.y, -direction.x);
        this.fade = fade;

        this.object.setAttribute("class", "particle");

        this.system.particles[this.id] = this;
    }

    update(deltaTime) {
        super.update();
        this.fadeProcess = lerp(this.fadeProcess, 0, this.fade * deltaTime);
        Debug.displayInfo("fade", this.fadeProcess);
        if (this.fadeProcess <= 0.01) {
            this.destroy();
            return;
        }

        this.x += this.forward.x * deltaTime;
        this.y += this.forward.y * deltaTime;
    }

    destroy() {
        super.destroy();
        delete this.system.particles[this.id];
    }
}