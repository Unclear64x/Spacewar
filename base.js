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
     */
    setState(state) {
        if (state == this.state)
            return;

        this.state = state;
        this.frame = 0;
        this.frames = this.states[state].length;

        if (this.timer != 0)
            clearInterval(this.timer);

        this.timer = setInterval(() => {
            this.obj.src = this.states[state][this.frame].src;
            this.frame = (this.frame + 1) % this.frames;
        }, this.durations[state]);
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