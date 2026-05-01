class Player extends DynamicObject {
    constructor(objects, x, y) {
        let collider = [
            new Vector(0.5, 0.5),
            new Vector(0,5, -0,5),
            new Vector(-0.5, -0.5),
            new Vector(-0,5, 0,5),
        ];

        super(objects, collider, "player", shipAnimation, "idle", x, y);
    }
}