// Dom Element
const cube = document.querySelector(".cube");
const autoBtn = document.querySelector(".autoBtn");

// Constant
const autoStr = "auto";

// Variable
let autoMovingInterval;
let isAutoRotating = false;

// Function - rotates the cube
function handleOrientation(event) {
    // get gyro State
    const alpha = event.alpha,
        beta = event.beta,
        gamma = event.gamma;
    // if no gyro state -> rotate with mouse movement
    if (!beta) addMouseEvent()
    // show gyro state
    document.getElementById("alpha").innerText = Math.round(alpha);
    document.getElementById("beta").innerText = Math.round(beta);
    document.getElementById("gamma").innerText = Math.round(gamma);
    // auto Move 상태면 종료
    if(cube.classList.contains(autoStr)) {
        // if it's already spinning -> No need auto rotate setting 
        if(isAutoRotating) return;
        // set auto rotate setting - cube
        let deg = 0;
        autoMovingInterval = setInterval(()=>{
            deg=deg-1;
            document.querySelector(".cube").style.transform = `rotateX(${deg}deg) rotateY(45deg)`;
        },10);
        // set auto rotate setting - autoBtn
        autoBtn.textContent = "Stop Auto Moving";
        autoBtn.setAttribute(autoStr,"true");
        // set auto rotation setting - state
        isAutoRotating = true;
    }else{
        // remove auto rotation setting - cube
        clearInterval(autoMovingInterval);
        cube.style.transform = `rotateX(${-beta}deg) rotateY(${gamma}deg) rotateZ(${alpha}deg)`;
        // remove auto rotation setting - autoBtn
        autoBtn.textContent = "Start Auto Moving";
        autoBtn.setAttribute(autoStr,"false");
        // remove auto rotation setting - state
        isAutoRotating = false;
    }
}

// Function - move cube using mouse moving
function handleMouseMove(event) {
    // get mouse position on mouse move event
    const x = event.clientX,
        y = event.clientY,
        w = window.outerWidth / 2,
        h = window.outerHeight / 2;
    // rotation using mouse position
    cube.style.transform = `rotateX(${y - h}deg) rotateY(${x - w}deg )`;
}
// function for gyro doesn't work situation
function addMouseEvent() {
    window.addEventListener("mousemove", handleMouseMove);
}
// Event
// add EventListener for gyro sensor
window.addEventListener("deviceorientation", handleOrientation);
// toggles the auto-rotation state based on a click on the button
autoBtn.addEventListener("click", ()=>cube.classList.toggle(autoStr));