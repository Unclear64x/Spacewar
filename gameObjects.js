class Ship extends DamageableObject {
    /**@type {ChildObject} */
    gun;

    constructor(id, objects, x, y) {
        let collider = [
            new Vector(0.5, 0.5),
            new Vector(0.5, -0.5),
            new Vector(-0.5, -0.5),
            new Vector(-0.5, 0.5),
        ];

        super(objects, collider, id, shipAnimation, "idle", x, y, 40);

        this.gun = this.addChild("gun", gunAnimation, "idle", 0, 20);
    }

    input(velocity, angularVelocity) {
        this.addVelocity(velocity, angularVelocity);

        if (velocity.x == 0 && velocity.y == 0 && this.animator.state != "idle")
            this.animator.setState("idle");
        else if (velocity.x != 0 && velocity.y != 0 && this.animator.state != "move")
            this.animator.setState("move");
    }

    lookAt(dot) {
        this.gun.angle = this.gun.globalPosition().scalar(dot);
        console.log(this.gun.angle);
    }
}

class Player extends Ship {
    constructor(objects, x, y) {
        super("player", objects, x, y);
    }
}

class Meteorite extends DamageableObject {
    constructor(objects, x, y) {
        let collider = [
            new Vector(-0.15625, -0.5),
            new Vector(-0.5, -0.359),
            new Vector(-0.5, 0.3),
            new Vector(0.25, 0.5),
            new Vector(0.5, -0.188),
        ];

        super(objects, collider, "meteorite", meteoriteAnimation, "none", x, y, 1000);
    }
}