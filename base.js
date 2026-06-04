class Animator {
    /**@type {String} */
    root = "";

    /**@type {Object<String, Array<HTMLImageElement>>} спрайты состояний по их состояниям*/
    states = {};

    /**@type {Object<String, Number>} длительность фрейма между состояниями*/
    durations = {};

    /**@type {Object} объект анимации*/
    obj;

    /**@type {Number} id таймера*/
    timer = 0;

    /**@type {String} текущее состояние анимации*/
    state = "";

    /**@type {Number} индекс фрейма*/
    frame = 0;

    /**@type {Number} кол-во фреймов*/
    frames = 0;

    #lastState;

    /**
     * 
     * @param {Object} params параметры анимации
     * @param {Object} target объект анимации
     * @param {String} startState начальное состояние
     */
    constructor(params, target, startState) {
        this.root = params["root"];
        this.loadSprites(params["states"]);

        this.obj = target;

        this.setState(startState);
    }

    /**
     * 
     * @param {*} states 
     */
    loadSprites(states) {
        Object.keys(states).forEach(x => {
            let imgs = [];
            for (let i = 0; i < states[x][0]; i++) {
                imgs[i] = new Image();
                imgs[i].src = this.getSourceByStateAndFrame(x, i);
            }
            this.states[x] = imgs;
            this.durations[x] = states[x][1];
        });
    }

    /**
     * Задаёт состояние анимации
     * @param {String} state состояние
     * @param {boolean} oneShot проиграть анимацию 1 раз
     */
    setState(state, oneShot = false) {
        if (state === this.state)
            return;

        if (oneShot && this.#lastState)
            this.state = this.#lastState;

        this.#lastState = this.state;

        // надо сделать так, чтобы при стрельбе, даже очень быстрой
        // таймер корректно возвращал this.state в исходное положение при oneShot
        // или просто при стрельбе пушке устанавливать duration между кадрами такой,
        // чтобы оставался запас по времени на сброс состояние
        

        // если снова забуду что делать: 
        
        // интегрировать анимации с параметром oneShot для выстрела пукалки
        
        // разобраться, почему пули больше не толкают объект при столкновении с метеоритом
        
        // сделать сдвиг камеры от игрока в сторону курсора как в секретном проекте steoc (вторая реализация псевдо 3д)
        // или вообще сделать отдельную систему для сдвига камеры, например при близости с противников (в границах экрана)
        // камера будет между игроком и ближ. противником
        // скорее всего через отдельный класс Camera с точкой обзора

        this.state = state;
        this.frame = 0;
        this.frames = this.states[state].length;

        if (this.timer != 0)
            clearInterval(this.timer);

        this.nextFrame();
        if (this.durations[state] != 0) {
            this.timer = setInterval(() => this.nextFrame(oneShot), this.durations[state]);
        }
        else {
            this.timer = 0;
        }
    }

    nextFrame(oneShot) {
        this.obj.src = this.states[this.state][this.frame++];
        this.frame %= this.frames;
        if (oneShot && this.frame == 0) {
            clearInterval(this.timer);
            this.setState(this.#lastState);
            this.#lastState = "";
        }
    }

    /**
     * Возвращает путь до изображения указанного фрейма по состоянию
     * @param {String} state состояние
     * @param {Number} frame номер фрейма
     * @returns путь до изображения
     */
    getSourceByStateAndFrame(state, frame) {
        return `sprites/${this.root}/${state}/${frame}.png`; 
    }
}

class Vector {
    x = 0;
    y = 0;

    #length = 0;
    #calculatedLength = false;

    static ZERO = new Vector(0, 0);

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Нормализует вектор
     */
    normalize() {
        let len = this.length();
        if (len != 0) {
            this.x /= len;
            this.y /= len;
        }
        this.#length = 1;
        return this;
    }

    /**
     * Возвращает длину вектора
     */
    length() {
        if (this.#calculatedLength)
            return this.#length;

        this.#calculatedLength = true;
        
        if (this.x == 0 && this.y == 0) {
            this.#length = 0
        }
        else {
            this.#length = (this.x ** 2 + this.y ** 2) ** 0.5;
        }

        return this.#length;
    }

    /**
     * Возвращает скалярное произведение векторов
     * @param {Vector} vector 
     */
    scalar(vector) {
        return (vector.x * this.x) + (vector.y * this.y);
    }

    /**
     * Возвращает векторное произведение
     * @param {Vector} vector 
     */
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    /**
     * Возвращает значение косинуса угла между векторами
     * @param {Vector} vector 
     */
    cos(vector) {
        let len1 = this.length();
        let len2 = vector.length();

        if (len1 == 0 || len2 == 0)
            return 0;

        return this.scalar(vector) / (len1 * len2);
    }

    /**
     * Устанавливает x и y
     * @param {Number} x 
     * @param {Number} y 
     */
    set(x, y) {
        this.#calculatedLength = this.#calculatedLength && this.x == x && this.y == y;
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * 
     * @param {Vector} vector 
     */
    set2(vector) {
        let x = this.x;
        let y = this.y;
        this.x = vector.x;
        this.y = vector.y;
        this.#calculatedLength = this.#calculatedLength && this.x == x && this.y == y;
        return this;
    }

    /**
     * Сложение с вектором
     * @param {Vector} vector 
     */
    add(vector) {
        this.#calculatedLength = this.#calculatedLength && vector.x == 0 && vector.y == 0;
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Вычитание из вектора
     * @param {Vector} vector 
     */
    remove(vector) {
        this.#calculatedLength = this.#calculatedLength && vector.x == 0 && vector.y == 0;
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Добавление чисел к координатам
     * @param {Number} x 
     * @param {Number} y 
     */
    add2(x, y) {
        this.#calculatedLength = this.#calculatedLength && x == 0 && y == 0;
        this.x += x;
        this.y += y;
        return this;
    }

    /**
     * Вычитание чисел из координат
     * @param {Number} x 
     * @param {Number} y 
     */
    remove2(x, y) {
        this.#calculatedLength = this.#calculatedLength && x == 0 && y == 0;
        this.x -= x;
        this.y -= y;
        return this;
    }

    /**
     * Умножение на число
     * @param {Number} number 
     */
    multiply(number) {
        this.#calculatedLength = this.#calculatedLength && number == 1;
        this.x *= number;
        this.y *= number;
        return this;
    }

    /**
     * Умножение каждой координаты на число
     * @param {Number} numberX 
     * @param {Number} numberY 
     */
    multiply2(numberX, numberY) {
        this.#calculatedLength = this.#calculatedLength && numberX == 1 && numberY == 1;
        this.x *= numberX;
        this.y *= numberY;
        return this;
    }

    /**
     * Поворачивает вектор
     * @param {Number} angle 
     */
    rotate(angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let x = this.x;

        this.x = x * cos - this.y * sin;
        this.y = x * sin + this.y * cos;

        this.#calculatedLength = false;

        return this;
    }

    /**
     * Делает вектор перпендикулярным себе (нормаль)
     */
    perpend() {
        let x = this.x;
        this.x = -this.y;
        this.y = x;
        return this;
    }

    /**
     * Плавно приближает координаты к точке
     * @param {Vector} to 
     * @param {Number} k 
     */
    lerp(to, k) {
        this.x = lerp(this.x, to.x, k);
        this.y = lerp(this.y, to.y, k);
        this.#calculatedLength = false;
        return this;
    }

    /**
     * Возвращает копию вектора
     */
    new() {
        return new Vector(this.x, this.y);
    }

    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}

class ShipParameters {
    /** макс. ускорение */
    maxVelocity = 300;
    /**ускорение */
    tickVelocity = 3;

    /**грубо говоря спринт */
    boost = 3;
    /**заряд спринта (от 0 с шагом в deltaTime, по сути в секундах) */
    charge = 1;
    /**скорость восстановления заряда в секунду */
    recharge = 0.2;

    /**урон от 10 до 25 */
    damage = 10;
    /**скорострельность от 0.25 до 2 */
    fireRate = 1;

    /**здоровье */
    health = 100;

    constructor(maxVelocity = 300, velocity = 3, boost = 3, charge = 1, recharge = 0.2, damage = 10, fireRate = 1, health = 100) {
        this.maxVelocity = maxVelocity;
        this.velocity = velocity;

        this.boost = boost;
        this.charge = charge;
        this.recharge = recharge;

        this.damage = damage;
        this.fireRate = fireRate;

        this.health = health;
    }
}