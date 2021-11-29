// Constant
const hidden = "hidden";
const emotionStr = "emotion";
const emotionlist = {
    angry : "angry",
    dizzy : "dizzy",
    expressionless : "expressionless",
    frown : "frown",
    heartEyes : "heart-eyes",
    laughing : "laughing",
    neutral : "neutral",
    smile : "smile",
    smileUpsideDown : "fsmile-upside-down",
    sunglasses : "sunglasses",
    wink : "wink",
}
// Dom element
const body = document.querySelector("body");
const ghost = document.querySelector(".ghost");
const iconFace = document.querySelector(".icon-face");
const i = document.querySelector(".icon-face i");
const basicFace = document.querySelector(".face");
const eyes = document.querySelectorAll(".eye");
const pupils = document.querySelectorAll(".pupil");
const mouse = document.querySelector(".mouse");
const orgleg = document.querySelectorAll(".leg");
const legs = document.querySelectorAll(".leg:nth-child(2n)");

// Variable
let isDragging = false;
let clickedCnt = 0;
let dblclickedCnt = 0;
let clickFlag = false;

// Function
function makeEmotion(emotion){
    // 기존표정을 지우고, 아이콘표정을 띄운다.(이때 아이콘 표정을 설정해준다)
    basicFace.style.display='none';
    iconFace.style.display = 'flex';
    i.className = `bi bi-emoji-${emotion}-fill`;
    setTimeout(unravelEmotion,1000,emotion);
}
function unravelEmotion(emotion){
    // 아이콘표정을 지우고, 기존표정을 띄운다
    basicFace.style.display='flex';
    iconFace.style.display = 'none';
}

// Event
// 드래그로 고스트 이동시키기
ghost.addEventListener("dragend",(e)=>{
    ghost.style.left = `${e.pageX-60}px`;
    ghost.style.top = `${e.pageY-80}px`;;
    isDragging = true;
});
// 드래그로 이동당해서 신난 고스트
ghost.addEventListener("dragover",(e)=>{
    makeEmotion(emotionlist.laughing);
    ghost.style.left = `${e.pageX-60}px`;
    ghost.style.top = `${e.pageY-80}px`;;
});
// 드래그로 이동 당한 후 어지러워하는 고스트
ghost.addEventListener("dragend",(e)=>{
    makeEmotion(emotionlist.dizzy);
    isDragging = false;
});
// 마우스를 쳐다보는 고스트의 눈
body.addEventListener("mousemove",(e)=>{
    let ghostPos = ghost.getBoundingClientRect();
    if(Math.abs(e.pageX-(ghostPos.left+60))>80 && Math.abs(e.pageY-(ghostPos.top+80))>80) {
        if(isDragging) return;
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
    if(!clickFlag){
        // 많이 안괴롭혔다면
        if(clickedCnt<5) {
            makeEmotion(emotionlist.laughing);
            clickedCnt+=1;
        // 많이 괴롭혔다면
        }else{
            makeEmotion(emotionlist.neutral);
            clickedCnt = 0;
        }
        clickFlag = true;
        setTimeout(clickFlag=false,500);
    }
});
ghost.addEventListener("dblclick", (e)=>{
    // 많이 안괴롭혔다면
    if(clickedCnt<5) {
        clickedCnt+=1;
        makeEmotion(emotionlist.heartEyes);
    // 많이 괴롭혔다면
    }else{
        makeEmotion(emotionlist.angry);
        clickedCnt = 0;
    }

});
