class Player extends DynamicObject {
    velocity;

    constructor(colliders, interactable, x, y) {
        let collider = [
            [0.5, 0.5],
            [0,5, -0,5],
            [-0.5, -0.5],
            [-0,5, 0,5],
        ];
        super(colliders, collider, "player", stickmanAnimation, "idle", x, y);

        this.interactable = interactable;
    }
}