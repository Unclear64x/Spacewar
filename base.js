class Animator {
    root;
    type;
    states;
    obj;
    timer = null;

    state;
    duration;
    frames;
    frame;

    constructor(params, target, startState) {
        this.root = params["root"];
        this.type = params["type"];
        this.states = params["states"];
        
        this.obj = target;
        this.obj.src = this.getSourceByState(startState);

        this.setState(startState);
    }

    loadSprites() {
        
    }

    setState(state) {
        console.log(this.states);
        if (state == this.state)
            return;

        this.state = this.states[state];
        this.frames = this.state[0];
        this.duration = this.state[1];
        this.frame = 0;

        if (this.timer != null)
            clearInterval(this.timer);

        this.timer = setInterval(() => {
            this.obj.src = this.getSourceByState(state);
            this.frame++;
            this.frame = this.frame > this.frames;
        }, this.duration);
    }

    getSourceByState(state) {
        return "sprites/" + this.root + "/" + state + "/" + this.frame + ".png"; 
    }
}