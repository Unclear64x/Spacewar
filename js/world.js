class World {
    /**@type {HTMLElement} */
    static Space;

    /**@type {Player} */
    static Player;

    static Objects = {};

    static DynamicObjects = {};

    static DamagableObjects = {};

    static ParticleSystems = {};

    static Enemies = {};

    static Meteorites = {};

    static ObjectDatas;

    static AI = true;

    static update(what, detlaTime) {
        for (let i in what) {
            i.update(detlaTime);
        }
    }

    static clear() {
        for (let i in World.Objects) {
            i.destroy();
        }
        
        for (let i in World.ParticleSystems) {
            i.destroy();
        }
    }
}