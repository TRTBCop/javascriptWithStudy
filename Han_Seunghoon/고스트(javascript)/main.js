// ########################## DOM ##########################
const wordElem = document.querySelector(".word");
const wallElem = document.querySelector(".wall-wrap");
const ghostElem = document.querySelector(".ghost");
const faceElem = document.querySelector(".face");

// ########################## Variable ##########################
let last_scroll = 0; //마지막에 스크롤한 위치

// ########################## Event ##########################
window.addEventListener("scroll", function() {  
    const currentY = this.pageYOffset; //스크롤하고 난 후 위치
    moveWall(currentY); //벽 움직이기
    ghostDirection(currentY); //유령 방향 움직이기
})
document.addEventListener("mousemove", function(e) {
    ghostElem.style.left = e.pageX + 'px';
})


// ########################## function ##########################
function moveWall(currentY) {
    const maxY = this.document.body.offsetHeight - this.innerHeight; //스크롤의 마지막 값
    const scroll_per = currentY/maxY; //스크롤 한 값을 퍼센테이지로 변경
    const total_length = 6000; //이동 최대 거리
    wallElem.style.transform = `translateZ(${total_length * scroll_per}px)`; //이동 시키기
}

function ghostDirection(currentY) {
    //스크롤 방향 체크후 처리
    if (currentY > last_scroll) {
        faceElem.style.display = "none";
    }else {        
        faceElem.style.display = "flex";
    }

    last_scroll = currentY; //마지막 스크롤 위치 담기
}