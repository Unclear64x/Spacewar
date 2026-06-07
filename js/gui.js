/**@type {HTMLElement} */
let menu;
/**@type {HTMLElement} */
let mainMenu, settings, upgrades;
/**@type {HTMLElement} */
let playButton, settingsButton, exitButton;
/**@type {HTMLElement} */
let settingsBack, upgradesBack;

/**@type {HTMLElement} */
let start, upgradesContainer;

let avaibleMetal, avaibleIrit, avaibleBorit, avaibleAneit;

let destroyed;

let guiSize;

addEventListener("DOMContentLoaded", () => {
    if (localStorage) {
        let tryNum = Number(localStorage["spacewar"]) || 1;

        if (tryNum < 3) {
            let spacewar = document.getElementById("spacewar");
            setTimeout(() => {
                spacewar.style.transform = "translate(0px, -6.5vmin)";
            }, 1000);
            setTimeout(() => {
                spacewar.style.transform = "translate(0px, 7.5vmin)";
            }, 5000);

            tryNum++;
            localStorage["spacewar"] = tryNum;
        }
    }

    menu = document.getElementById("menu");

    mainMenu = document.getElementById("mainMenu");
    settings = document.getElementById("settings");
    upgrades = document.getElementById("upgrades");

    playButton = document.getElementById("playButton");
    settingsButton = document.getElementById("settingsButton");
    exitButton = document.getElementById("exitButton");

    settingsBack = document.getElementById("settingsBack");
    upgradesBack = document.getElementById("upgradesBack");

    start = document.getElementById("start");
    upgradesContainer = document.getElementById("upgradesContainer");

    avaibleMetal = document.getElementById("avaibleMetal");
    avaibleIrit = document.getElementById("avaibleIrit");
    avaibleBorit = document.getElementById("avaibleBorit");
    avaibleAneit = document.getElementById("avaibleAneit");

    destroyed = document.getElementById("destroyed");
    guiSize = document.getElementById("guiSize");

    playButton.addEventListener("click", () => switchVisible(mainMenu, upgrades));
    settingsButton.addEventListener("click", () => switchVisible(mainMenu, settings));
    exitButton.addEventListener("click", () => exitButton.innerText = "Закрой вкладку самостоятельно");

    settingsBack.addEventListener("click", () => switchVisible(settings, mainMenu));
    upgradesBack.addEventListener("click", () => switchVisible(upgrades, mainMenu));

    upgradesBack.addEventListener("click", () => switchVisible(upgrades, mainMenu));
    
    guiSize.addEventListener("change", () => {
        document.body.style.setProperty("--size-addition", guiSize.value + "vmin");
        if (localStorage) {
            localStorage["guiSize"] = guiSize.value;
        }
    });
});

function switchVisible(off, on) {
    off.style.display = "none";
    on.style.display = "flex";
}

let avaibleUpgrades = {
    "tickVelocity": ["Ускорение", 8, 10, 50, 30, 20, 1],
    "boost": ["Буст", 5, 70, 0, 90, 150, 1],
    "charge": ["Заряд", 5, 0, 100, 50, 0, 1],
    "recharge": ["Восстановление заряда", 1, 100, 100, 100, 0, 0.2],
    "damage": ["Урон", 25, 100, 80, 50, 10, 2.5],
    "fireRate": ["Темп стрельбы", 5, 150, 0, 150, 150, 1],
    "health": ["Здоровье", 1000, 50, 100, 50, 50, 100]
}

let createdUpgrades = {};
let avaibleMaterials = ["metal", "irit", "borit", "aneit"];
let materialNames = {"metal": "Метал", "irit": "Ирит", "borit": "Борит", "aneit": "Анеит"};

function updateUpgrades() {
    for (let x in createdUpgrades) {
        createdUpgrades[x][0].value = PlayerInfo.ShipParameters[x] / avaibleUpgrades[x][1];
        let canBuy = true;
        for (let i in createdUpgrades[x][1]) {
            let avaible = PlayerInfo.Inventory[i] >= createdUpgrades[x][1][i][0];
            canBuy = canBuy && avaible;
            createdUpgrades[x][1][i][1].setAttribute("class", "upgrade-resource" + (avaible ? "" : " danger"));
        }
        createdUpgrades[x][2].disabled = !canBuy;
    };

    avaibleMetal.innerText = PlayerInfo.Inventory["metal"];
    avaibleIrit.innerText = PlayerInfo.Inventory["irit"];
    avaibleBorit.innerText = PlayerInfo.Inventory["borit"];
    avaibleAneit.innerText = PlayerInfo.Inventory["aneit"];
}

function createUpgrades() {
    for (let x in avaibleUpgrades) {
        let upgrade = document.createElement("div");
        upgrade.setAttribute("class", "upgrade");
        let name = document.createElement("span");
        name.innerText = avaibleUpgrades[x][0];
        let progress = document.createElement("progress");
        progress.value = PlayerInfo.ShipParameters[x] / avaibleUpgrades[x][1];
        createdUpgrades[x] = [progress, {}];
        let upgradeResources = document.createElement("div");
        upgradeResources.setAttribute("class", "upgrade-resources");
        let canBuy = progress.value < 1;
        for (let i = 2; i < 6; i++) {
            let count = avaibleUpgrades[x][i];
            if (!count)
                continue;
            let avaible = PlayerInfo.Inventory[avaibleMaterials[i - 2]] >= count;
            canBuy = canBuy && avaible;
            let upgradeResource = document.createElement("div");
            upgradeResource.setAttribute("class", "upgrade-resource" + (avaible ? "" : " danger"));
            let image = document.createElement("img");
            image.src = materials[avaibleMaterials[i - 2]].src;
            image.alt = avaibleMaterials[i - 2];
            let resCount = document.createElement("span");
            resCount.innerText = count;
            upgradeResource.append(image, resCount);
            upgradeResources.append(upgradeResource);
            createdUpgrades[x][1][avaibleMaterials[i - 2]] = [count, upgradeResource];
        }
        let buy = document.createElement("button");
        buy.innerText = "Улучшить";
        buy.setAttribute("class", "buy-button");
        buy.disabled = !canBuy;
        buy.addEventListener("click", () => {
            buy.disabled = true;
            PlayerInfo.ShipParameters[x] += avaibleUpgrades[x][6];
            for (let i in createdUpgrades[x][1]) {
                PlayerInfo.Inventory[i] -= createdUpgrades[x][1][i][0];
            }
            updateUpgrades();
            save();
        });
        createdUpgrades[x][2] = buy;
        upgrade.append(name, progress, upgradeResources, buy);
        upgradesContainer.append(upgrade);
    }

    avaibleMetal.innerText = PlayerInfo.Inventory["metal"];
    avaibleIrit.innerText = PlayerInfo.Inventory["irit"];
    avaibleBorit.innerText = PlayerInfo.Inventory["borit"];
    avaibleAneit.innerText = PlayerInfo.Inventory["aneit"];
}