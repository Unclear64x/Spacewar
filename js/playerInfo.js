class Inventory {
    metal = 0;
    irit = 0;
    borit = 0;
    aneit = 0;

    load() {
        if (!localStorage || !localStorage["inventory"])
            return;

        let json = JSON.parse(localStorage["inventory"]);

        for (let i in json) {
            this[i] = json[i];
        }

        // Inventory.metal = Number(localStorage["metal"]) || 0;
        // Inventory.irit = Number(localStorage["irit"]) || 0;
        // Inventory.borit = Number(localStorage["borit"]) || 0;
        // Inventory.aneit = Number(localStorage["aneit"]) || 0;
    }

    save() {
        if (!localStorage)
            return;

        let json = JSON.stringify(this);

        localStorage["inventory"] = json;

        // localStorage["metal"] = Inventory.metal;
        // localStorage["irit"] = Inventory.irit;
        // localStorage["borit"] = Inventory.borit;
        // localStorage["aneit"] = Inventory.aneit;
    }
}

class PlayerInfo {
    static ShipParameters = new ShipParameters();
    static Inventory = new Inventory();

    static load() {
        if (!localStorage || !localStorage["playerInfo"])
            return;

        let json = JSON.parse(localStorage["playerInfo"]);
        for (let i in json) {
            PlayerInfo.ShipParameters[i] = json[i];
        }
        this.Inventory.load();
        // PlayerInfo.ShipParameters["maxVelocity"] = Number(localStorage["maxVelocity"]) || 300;
        // PlayerInfo.ShipParameters["tickVelocity"] = Number(localStorage["tickVelocity"]) || 3;
        // PlayerInfo.ShipParameters["boost"] = Number(localStorage["boost"]) || 3;
        // PlayerInfo.ShipParameters["charge"] = Number(localStorage["charge"]) || 1;
        // PlayerInfo.ShipParameters["recharge"] = Number(localStorage["recharge"]) || 0.2;
        // PlayerInfo.ShipParameters["damage"] = Number(localStorage["damage"]) || 10;
        // PlayerInfo.ShipParameters["fireRate"] = Number(localStorage["fireRate"]) || 1;
        // PlayerInfo.ShipParameters["health"] = Number(localStorage["health"]) || 100;
    }

    static save() {
        if (!localStorage)
            return;

        let json = JSON.stringify(PlayerInfo.ShipParameters)
        
        localStorage["playerInfo"] = json;

        this.Inventory.save();

        // localStorage["maxVelocity"] = PlayerInfo.ShipParameters["maxVelocity"];
        // localStorage["tickVelocity"] = PlayerInfo.ShipParameters["tickVelocity"];
        // localStorage["boost"] = PlayerInfo.ShipParameters["boost"];
        // localStorage["charge"] = PlayerInfo.ShipParameters["charge"];
        // localStorage["recharge"] = PlayerInfo.ShipParameters["recharge"];
        // localStorage["damage"] = PlayerInfo.ShipParameters["damage"];
        // localStorage["fireRate"] = PlayerInfo.ShipParameters["fireRate"];
        // localStorage["health"] = PlayerInfo.ShipParameters["health"];
    }
}