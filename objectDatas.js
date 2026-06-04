class ObjectData {
    update(owner) {}
    remove(owner) {}
}

class AimedData extends ObjectData {
    /**@type {BaseObject} */
    target;
    data = {};

    /**
     * @param {BaseObject} target
     * @param {}
    */
    constructor(target, data) {
        this.target = target;
        this.data = data;
    }

    /**@param {BaseObject} owner */
    update(owner) {
        let vectorToTarget = owner.globalPosition.new().remove(this.target.globalPosition);
        const tan = Math.atan2(vectorToTarget.y, vectorToTarget.x);

    }

    remove(owner) {

    }
}