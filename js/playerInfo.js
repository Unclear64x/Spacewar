class PlayerInfo {
    static ShipParameters = new ShipParameters();

    static load() {
        if (!localStorage)
            return;

        PlayerInfo.ShipParameters["maxVelocity"] = localStorage["maxVelocity"] ?? 300;
        PlayerInfo.ShipParameters["tickVelocity"] = localStorage["tickVelocity"] ?? 3;
        PlayerInfo.ShipParameters["boost"] = localStorage["boost"] ?? 3;
        PlayerInfo.ShipParameters["charge"] = localStorage["charge"] ?? 1;
        PlayerInfo.ShipParameters["recharge"] = localStorage["recharge"] ?? 0.2;
        PlayerInfo.ShipParameters["damage"] = localStorage["damage"] ?? 10;
        PlayerInfo.ShipParameters["fireRate"] = localStorage["fireRate"] ?? 1;
        PlayerInfo.ShipParameters["health"] = localStorage["health"] ?? 100;
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
    static Metal = 0;
    static Irit = 0;
    static Borit = 0;
    static Aneit = 0;

    static load() {
        if (!localStorage)
            return;

        Inventory.Metal = localStorage["metal"] ?? 0;
        Inventory.Irit = localStorage["irit"] ?? 0;
        Inventory.Borit = localStorage["borit"] ?? 0;
        Inventory.Aneit = localStorage["aneit"] ?? 0;
    }

    static save() {
        if (!localStorage)
            return;

        localStorage["metal"] = Inventory.Metal;
        localStorage["irit"] = Inventory.Irit;
        localStorage["borit"] = Inventory.Borit;
        localStorage["aneit"] = Inventory.Aneit;
    }
}