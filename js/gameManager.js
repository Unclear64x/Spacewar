class GameManager {
    static SpawnEnemyTimer;
    static SpawnMeteoriteTimer;

    static SpawnEnemyTime = [];
    static SpawnMeteoriteTime = [];

    static MaxMeteoritesCount = 30;
    static MaxEnemiesCount = 2;

    static DistanceFromPlayer = 2000;
    static Range = GameManager.DistanceFromPlayer + 1000;


    static update() {
        if (World.Player.destroyed) 
            return;

        let meteorites = Object.keys(World.Meteorites);
        let enemies = Object.keys(World.Enemies);

        if (meteorites.length < GameManager.MaxMeteoritesCount && !GameManager.SpawnMeteoriteTimer) {
            let time = random(500, 2000);
            GameManager.SpawnMeteoriteTime[0] = time;
            GameManager.SpawnMeteoriteTime[1] = Date.now();

            GameManager.SpawnMeteoriteTimer = setTimeout(() => {
                let position = GameManager.spawnPosition();
                let meteorite = new Meteorite(position.x, position.y);
                meteorite.angle = random(0, Math.PI * 2);
                GameManager.SpawnMeteoriteTimer = null;
                GameManager.SpawnMeteoriteTime[0] = 0;
                GameManager.SpawnMeteoriteTime[1] = 0;
            }, time);
        }

        if (enemies.length < GameManager.MaxEnemiesCount && !GameManager.SpawnEnemyTimer) {
            let time = random(20000, 60000);
            GameManager.SpawnEnemyTime[0] = time;
            GameManager.SpawnEnemyTime[1] = Date.now();

            GameManager.SpawnEnemyTimer = setTimeout(() => {
                let position = GameManager.spawnPosition();
                let enemy = new Enemy(position.x, position.y, PlayerInfo.ShipParameters);
                enemy.angle = random(0, Math.PI * 2);
                GameManager.SpawnEnemyTimer = null;
                GameManager.SpawnEnemyTime[0] = 0;
                GameManager.SpawnEnemyTime[1] = 0;
            }, time);
        }

        Debug.displayInfo("game manager", "meteorites", meteorites.length);
        Debug.displayInfo("game manager", "enemies", enemies.length);
        GameManager.debugSpawnTimer("SpawnMeteoriteTime", GameManager.SpawnMeteoriteTime);
        GameManager.debugSpawnTimer("GameManager.SpawnEnemyTime", GameManager.SpawnEnemyTime);

        GameManager.debugSpawnArea();
    }

    static debugSpawnTimer(id, data) {
        let timeRange = data[0];
        let start = data[1];

        Debug.displayInfo("game manager", id, timeRange - (Date.now() - start));
    }

    static debugSpawnArea() {
        let playerPos = World.Player.globalPosition;

        ////////////////////////////////////////////////////////////////////////////
        Debug.displayLine("spawnArea left 1",
            new Vector(playerPos.x - GameManager.DistanceFromPlayer, playerPos.y - GameManager.Range),
            new Vector(playerPos.x - GameManager.DistanceFromPlayer, playerPos.y + GameManager.Range), "red"
        );
        Debug.displayLine("spawnArea left 2",
            new Vector(playerPos.x - GameManager.Range, playerPos.y + GameManager.Range),
            new Vector(playerPos.x - GameManager.Range, playerPos.y - GameManager.Range), "red"
        );

        ////////////////////////////////////////////////////////////////////////////
        Debug.displayLine("spawnArea right 1",
            new Vector(playerPos.x + GameManager.DistanceFromPlayer, playerPos.y + GameManager.Range),
            new Vector(playerPos.x + GameManager.DistanceFromPlayer, playerPos.y - GameManager.Range), "red"
        );

        Debug.displayLine("spawnArea right 2",
            new Vector(playerPos.x + GameManager.Range, playerPos.y - GameManager.Range),
            new Vector(playerPos.x + GameManager.Range, playerPos.y + GameManager.Range), "red"
        );

        ////////////////////////////////////////////////////////////////////////////
        Debug.displayLine("spawnArea top 1",
            new Vector(playerPos.x - GameManager.Range, playerPos.y - GameManager.Range),
            new Vector(playerPos.x + GameManager.Range, playerPos.y - GameManager.Range), "red"
        );

        Debug.displayLine("spawnArea top 2",
            new Vector(playerPos.x - GameManager.Range, playerPos.y - GameManager.DistanceFromPlayer),
            new Vector(playerPos.x + GameManager.Range, playerPos.y - GameManager.DistanceFromPlayer), "red"
        );

        ////////////////////////////////////////////////////////////////////////////
        Debug.displayLine("spawnArea bottom 1",
            new Vector(playerPos.x - GameManager.Range, playerPos.y + GameManager.Range),
            new Vector(playerPos.x + GameManager.Range, playerPos.y + GameManager.Range), "red"
        );

        Debug.displayLine("spawnArea bottom 2",
            new Vector(playerPos.x - GameManager.Range, playerPos.y + GameManager.DistanceFromPlayer),
            new Vector(playerPos.x + GameManager.Range, playerPos.y + GameManager.DistanceFromPlayer), "red"
        );
    }

    static spawnPosition() {
        let side = randomInt(0, 3);
        let position = new Vector(0, 0);

        let playerPos = World.Player.globalPosition;
        switch (side) {
            case 0: // слева
                position.set(
                    random(playerPos.x - GameManager.Range, playerPos.x - GameManager.DistanceFromPlayer),
                    random(playerPos.y - GameManager.Range, playerPos.y + GameManager.Range)
                )
                break;
            
            case 1: // справа
                position.set(
                    random(playerPos.x + GameManager.DistanceFromPlayer, playerPos.x + GameManager.Range),
                    random(playerPos.y - GameManager.Range, playerPos.y + GameManager.Range)
                )
                break;
            
            case 2: // сверху
                position.set(
                    random(playerPos.x - GameManager.Range, playerPos.x + GameManager.Range),
                    random(playerPos.y - GameManager.Range, playerPos.y - GameManager.DistanceFromPlayer)
                )
                break;
            
            case 3: // снизу
                position.set(
                    random(playerPos.x - GameManager.Range, playerPos.x + GameManager.Range),
                    random(playerPos.y + GameManager.DistanceFromPlayer, playerPos.y + GameManager.Range)
                )
                break;
        }

        while (true) {
            let positionCorrect = true;

            for (let i in World.Objects) {
                let object = World.Objects[i];

                if (object instanceof Player || object instanceof ChildObject)
                    continue;

                if (position.new().remove(object.globalPosition).length() < MIN_DISTANCE_TO_OBJECT * 2) {
                    position.remove(playerPos.new().remove(position).normalize().multiply(MIN_DISTANCE_TO_OBJECT * 2));
                    positionCorrect = false;
                    break;
                }
            }

            if (positionCorrect)
                break;
        }

        return position;
    }
}