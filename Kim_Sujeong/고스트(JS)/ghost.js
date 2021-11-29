// Constant
const emotionStr = "emotion";
const emotionlist = {
    surprised : "surprised",
    happy : "happy",
    tickle : "tickle",
    angry : "angry",
    depressed : "depressed",
    excited : "excited",
    relaxed : "relaxed",
    glance : "glance",
}
// Dom element
const body = document.querySelector("body");
const ghost = document.querySelector(".ghost");
const eyes = document.querySelectorAll(".eye");
const pupils = document.querySelectorAll(".pupil");
const orgleg = document.querySelectorAll(".leg")
const legs = document.querySelectorAll(".leg:nth-child(2n)")

// Variable
let conditions ={
    isDragging : false,
    clickedCnt : 0,
    dblclickedCnt : 0,
}

// Function
function makeEmotion(emotion){
    eyes.forEach(element => element.setAttribute(emotionStr,emotion));
    setTimeout(unravelEmotion,1000,emotion);
}
function unravelEmotion(emotion){
    eyes.forEach(element => element.removeAttribute(emotionStr,emotion));
}

// Event
let isDragging = false;
// 드래그로 고스트 이동시키기
ghost.addEventListener("dragend",(e)=>{
    ghost.style.left = `${e.pageX-60}px`;
    ghost.style.top = `${e.pageY-80}px`;;
    conditions.isDragging = true;
});
// 드래그로 이동당해서 신난 고스트
ghost.addEventListener("dragover",(e)=>{
    makeEmotion(emotionlist.excited);
});
// 드래그로 이동 당한 후 안심하는 고스트
ghost.addEventListener("dragend",(e)=>{
    makeEmotion(emotionlist.relaxed);
    conditions.isDragging = false;
});
// 마우스를 쳐다보는 고스트의 눈
body.addEventListener("mousemove",(e)=>{
    let ghostPos = ghost.getBoundingClientRect();
    if(Math.abs(e.pageX-(ghostPos.left+60))>80 && Math.abs(e.pageY-(ghostPos.top+80))>80) {
        if(conditions.isDragging) return;
        eyes.forEach(eye=>{
            let eyePos = eye.getBoundingClientRect();
            let rad = Math.atan2(e.pageY - (eyePos.y+eyePos.height*0.5), e.pageX-(eyePos.x+eyePos.width*0.5));
            pupils.forEach(p=>{ 
                p.style.transform = `rotate(${180*rad/Math.PI-30}deg)`;
            });
        });
    }
});
// 클릭당했을 때 웃어주다가 너무 많아지면 화냄
ghost.addEventListener("click", (e)=>{
    if(conditions.clickedCnt<5) makeEmotion(emotionlist.happy)
    else {
        makeEmotion(emotionlist.angry);
        conditions.clickedCnt = 0;
    }
    conditions.clickedCnt+=1;
});
// 더블클릭 당하면 간지럼 탐 그러다 너무 많이 간지럼 태우면 화냄
ghost.addEventListener("dblclick", ()=>{
    if(conditions.dblclickedCnt<5) makeEmotion(emotionlist.tickle)
    else {
        makeEmotion(emotionlist.tickle)
        conditions.dblclickedCnt = 0;
    }
    conditions.dblclickedCnt+=1;
});