class Animator {
    /**@type {String} */
    root = "";

    /**@type {Object<String, Array<HTMLImageElement>>} спрайты состояний по их состояниям*/
    states = {};

    /**@type {Object<String, Number>} длительность фрейма между состояниями*/
    durations = {};

    /**@type {HTMLImageElement} объект анимации, <img>*/
    obj = null;

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
     * @param {HTMLImageElement} target объект анимации, <img>
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
        this.obj.src = this.states[this.state][this.frame++].src;
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
        return this;
    }

    /**
     * Возвращает длину вектора
     */
    length() {
        if (this.x == 0 && this.y == 0)
            return 0;

        return (this.x ** 2 + this.y ** 2) ** 0.5;
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
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * 
     * @param {Vector} vector 
     */
    set2(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /**
     * Сложение с вектором
     * @param {Vector} vector 
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Вычитание из вектора
     * @param {Vector} vector 
     */
    remove(vector) {
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
        this.x += x;
        this.y += y;
        return this;
    }

    /**
     * Умножение на число
     * @param {Number} number 
     */
    multiply(number) {
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
     * Возвращает копию вектора
     */
    new() {
        return new Vector(this.x, this.y);
    }
}