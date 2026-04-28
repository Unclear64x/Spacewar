window.addEventListener("DOMContentLoaded", ready);

let text;
let debug;

function ready() {
    text = document.getElementById("text");
    debug = document.getElementById("debug");
    window.addEventListener("mousemove", move);
}


function move(event) {
    //document.getElementById().innerText
    let pr = (event.clientX * 200 + event.clientY * 400) / (200 ** 2 + 400 ** 2) ** 0.5;
    debug.innerText = `${event.clientX} ${event.clientY} ${pr}`
    
}