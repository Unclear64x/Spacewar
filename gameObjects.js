class Ship extends DamageableObject {
    constructor(id, objects, x, y) {
        let collider = [
            new Vector(0.5, 0.5),
            new Vector(0.5, -0.5),
            new Vector(-0.5, -0.5),
            new Vector(-0.5, 0.5),
        ];

        super(objects, collider, id, shipAnimation, "idle", x, y);
    }

    input(velocity, angularVelocity) {
        this.addVelocity(velocity, angularVelocity);

        if (velocity.x == 0 && velocity.y == 0 && this.animator.state != "idle")
            this.animator.setState("idle");
        else if (velocity.x != 0 && velocity.y != 0 && this.animator.state != "move")
            this.animator.setState("move");
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

        super(objects, collider, "meteorite", meteoriteAnimation, "none", x, y);
    }
}