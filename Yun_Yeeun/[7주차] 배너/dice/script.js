const dice = document.querySelector(".dice")
const MODES= ["X","Y","Z"]
const DEGS= [0,90,180,270]
let prevTransform=""

dice.addEventListener("click",rotateRandom)

function getTransformStr(mode,deg){
    return `rotate${mode.toUpperCase()}(${deg}deg) `
}
function getRandomDegree(){
    return DEGS[Math.floor(Math.random()*DEGS.length)];
}

function rotate() {
  rotateSth(0)
    }

    function rotateSth(modeIdx) {
    if(modeIdx>=MODES.length)return;
        let mode = MODES[modeIdx]
        let deg = 0
        let interval = setInterval(() => {
            deg = deg + 90
            dice.style.transform = prevTransform + getTransformStr(mode, deg);
            console.log(dice.style.transform);
        }, 100)
        setTimeout(() => {
            clearInterval(interval)
            dice.style.transform = prevTransform + getTransformStr(mode, getRandomDegree());
            prevTransform = dice.style.transform;
            rotateSth(modeIdx+1)
        }, 3000)
}

function rotateRandom(){
    dice.style.transform=""
    prevTransform=dice.style.transform
    rotate()
}



