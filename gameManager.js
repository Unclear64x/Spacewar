class GameManager {
    static spawnEnemyTimer;
    static  spawnMeteoriteTimer;

    static spawnEnemyTime = [];
    static spawnMeteoriteTime = [];


    static update() {
        let meteorites = Object.keys(World.Meteorites);
        if (meteorites.length < 10 && !GameManager.spawnMeteoriteTimer) {
            Debug.displayInfo("spawnMeteoriteTimer");
            let time = random(1000, 5000);
            GameManager.spawnMeteoriteTime[0] = time;
            GameManager.spawnMeteoriteTime[1] = Date.now();

            GameManager.spawnMeteoriteTimer = setTimeout(() => {
                let position = GameManager.spawnPosition();
                let meteorite = new Meteorite(position.x, position.y);
                meteorite.angle = random(0, Math.PI * 2);
                GameManager.spawnMeteoriteTimer = null;
                GameManager.spawnMeteoriteTime[0] = 0;
                GameManager.spawnMeteoriteTime[1] = 0;
            }, time);
        }

        GameManager.debugSpawnTimer("meteoriteTime", GameManager.spawnMeteoriteTime);
    }

    static debugSpawnTimer(id, data) {
        let timeRange = data[0];
        let start = data[1];

        Debug.displayInfo(id, timeRange - (Date.now() - start));
    }

    static spawnPosition() {
        let side = randomInt(0, 3);
        let distanceFromPlayer = Math.min(window.innerHeight * 2, window.innerWidth * 2);
        let range = distanceFromPlayer + 200;;

        let position = new Vector(0, 0);

        let playerPos = World.Player.globalPosition;
        switch (side) {
            case 0: // слева
                position.set(
                    random(playerPos.x - range, -distanceFromPlayer),
                    random(playerPos.y - range, playerPos.y + range)
                )
                break;
            
            case 1: // справа
                position.set(
                    random(distanceFromPlayer, playerPos.x + range),
                    random(playerPos.y - range, playerPos.y + range)
                )
                break;
            
            case 2: // сверху
                position.set(
                    random(playerPos.x - range, playerPos.x + range),
                    random(playerPos.y - range, -distanceFromPlayer)
                )
                break;
            
            case 3: // снизу
                position.set(
                    random(playerPos.x - range, playerPos.x + range),
                    random(distanceFromPlayer, playerPos.y + range)
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
                    position.add(playerPos.new().remove(position).normalize().multiply(MIN_DISTANCE_TO_OBJECT * 2));
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