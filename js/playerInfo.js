class PlayerInfo {
    static ShipParameters = new ShipParameters();

    static load() {
        if (!localStorage)
            return;

        PlayerInfo.ShipParameters["maxVelocity"] = Number(localStorage["maxVelocity"]) ?? 300;
        PlayerInfo.ShipParameters["tickVelocity"] = Number(localStorage["tickVelocity"]) ?? 3;
        PlayerInfo.ShipParameters["boost"] = Number(localStorage["boost"]) ?? 3;
        PlayerInfo.ShipParameters["charge"] = Number(localStorage["charge"]) ?? 1;
        PlayerInfo.ShipParameters["recharge"] = Number(localStorage["recharge"]) ?? 0.2;
        PlayerInfo.ShipParameters["damage"] = Number(localStorage["damage"]) ?? 10;
        PlayerInfo.ShipParameters["fireRate"] = Number(localStorage["fireRate"]) ?? 1;
        PlayerInfo.ShipParameters["health"] = Number(localStorage["health"]) ?? 100;
    }

    static save() {
        if (!localStorage)
            return;
        
        localStorage["maxVelocity"] = PlayerInfo.ShipParameters["maxVelocity"];
        localStorage["tickVelocity"] = PlayerInfo.ShipParameters["tickVelocity"];
        localStorage["boost"] = PlayerInfo.ShipParameters["boost"];
        localStorage["charge"] = PlayerInfo.ShipParameters["charge"];
        localStorage["recharge"] = PlayerInfo.ShipParameters["recharge"];
        localStorage["damage"] = PlayerInfo.ShipParameters["damage"];
        localStorage["fireRate"] = PlayerInfo.ShipParameters["fireRate"];
        localStorage["health"] = PlayerInfo.ShipParameters["health"];
    }
}

class Inventory {
    static metal = 0;
    static irit = 0;
    static borit = 0;
    static aneit = 0;

    static load() {
        if (!localStorage)
            return;

        Inventory.metal = Number(localStorage["metal"]) ?? 0;
        Inventory.irit = Number(localStorage["irit"]) ?? 0;
        Inventory.borit = Number(localStorage["borit"]) ?? 0;
        Inventory.aneit = Number(localStorage["aneit"]) ?? 0;
    }

    static save() {
        if (!localStorage)
            return;

        localStorage["metal"] = Inventory.metal;
        localStorage["irit"] = Inventory.irit;
        localStorage["borit"] = Inventory.borit;
        localStorage["aneit"] = Inventory.aneit;
    }
}