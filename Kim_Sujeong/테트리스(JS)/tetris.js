import BLOCKS from "./blocks.js"

// DOM
const playground = document.querySelector(".playground > ul"); //  querySelector : 해당 태그 내용들을 모두 담아 가져옴.
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector("#score");
const timer = document.querySelector("#timer");
const startBtn = document.querySelector(".startBtn");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;
const hiddenClassText = "hidden";
const INITIAL_TIME = "00:00"

// Vairables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem; // 무빙 전에 잠깐 담아두는 변수
let isPlay = false;
let time = 0;
let timerInterval;

const movingItem = { // 블럭의 타입과 정보를 담은 변수
    type : "", // 도형 타입
    direction : 2, // 도형 방향
    top : 0, // 현재 상하 위치
    left : 0, // 현재 좌우 위치
};

// Constructor
init();

// functions
function init(){ // 처음 시작될 때 호출되는 함수
    // spread Operator ({... 변수명}) : movingItem의 값만 가져오기 때문에 movingItem이 변경되어도 tempMovingItem은 영향X
    tempMovingItem = {...movingItem}; 

    // make sheet
    for(let i = 0 ; i<GAME_ROWS ;i++) prependNewLine();
}

function play(){
    isPlay=true;
    timerInterval = setInterval(()=>{
        updateTimer();
    }, 1000);
    generateNewBlock();
}

function resetTimer(){
    time = 0;
    clearInterval(timerInterval);
    timer.innerText=INITIAL_TIME;
}

function gameOver(){
    clearInterval(downInterval);
    resetTimer();
    isPlay=false;
}

// timer
function updateTimer(){
    if(isPlay){
        time++;
        let min = Math.round(time/60);
        let sec = Math.round(time - (time/60));
        let minText = min.toString().padStart(2,"0");
        let secText = sec.toString().padStart(2,"0");
        timer.innerText = minText+":"+secText;
    }
}

// 한줄을 완성했을때 그 줄을 다시 만드는 함수
function prependNewLine(){
    const li = document.createElement("li"); // createElement : 해당 태그를 만듦
    const ul = document.createElement("ul");
    for(let j = 0 ; j<GAME_COLS ; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix); // 부모(ul)의 자식요소로 추가, but 맨 앞에 추가가 되어짐(<-> appendChild 맨 뒤에 추가됨.)
    }
    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType = ""){
    // Destructuring : tempMovingItem의 변수들을 미리 분리해서 해당 함수에서 (const떄문) 사용할 수 있게함.
    const {type, direction, top, left} = tempMovingItem; 
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove(type,"moving");
    })
    
    BLOCKS[type][direction].some(block=>{ // forEach는 return으로 반복문 중지를 할 수 없다.  some은 가능.
        const x = block[0] + left;
        const y = block[1] + top;

        // ul안의 li안의 ul안의 li (tetris내부 찾아가는거임.)
        // 있는 블록인지 체크 후 넣기
        const target = playground.childNodes[y]
            ? playground.childNodes[y].childNodes[0].childNodes[x] 
            : null; 
        if(checkEmpty(target)) {
            target.classList.add(type, "moving");
        } else{
            // 좌표를 다시 원상태로 옮기고 재귀함수 부름.
            tempMovingItem = { ...movingItem};
            
            // 종료
            if(moveType === 'retry'){
                gameOver();
            }

            setTimeout(()=>{ //주어진 일을 끝내고 부르도록 순서 변경(call stack에러 수정)
                renderBlocks('retry'); 
                if(moveType === "top"){
                    seizeBlock();
                }
            },0)
            return true; // 빈값이 있으면 굳이 나머지 3개의 칸을 다 방문할 필요없이 종료하도록 함.
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

// 블럭이 더이상 내려가지 않도록 함.(더이상 내려갈 곳이 없으면 새로운 블록 만들도록 처리)
function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch();
}
function checkMatch(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.childNodes[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){ // 한줄에 seized된 칸이 하나라도 있으면 그 칸이 다 채워진게 아님..(seized는 안착했을 때니까 아직 떨어지고 있거나 그 줄에 빈칸이 있는 것.)
                matched=false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score+=100;
            scoreDisplay.innerText = score;
        }
    })
    generateNewBlock();
}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top',1);
    }, duration);

    const blockArr = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random()*blockArr.length);
    
    movingItem.type =  blockArr[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks();
}

// target이 있는지 유무 체크
function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}

// block moving
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection(){
    const direction =  tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction+=1;
    renderBlocks();
}

function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top",1);
    },10);

}

// Event Handling
document.addEventListener("keydown", e=>{
    // Switch는 ===을 사용함. (값과 데이터타입까지 동일해야함.)
    switch(e.key){ 
        case "ArrowRight" : 
            moveBlock("left",1);
            break;
        case "ArrowLeft" : 
            moveBlock("left",-1);
            break;
        case "ArrowDown" : 
            moveBlock("top",1);
            break;
        case "ArrowUp" : 
            changeDirection();
            break;
        case " ":
            dropBlock();
            break;
        default:
            console.log("default");
            break;
    }
});



startBtn.addEventListener("click",()=>{
    playground.innerHTML="";
    startBtn.innerText = "다시시작"
    resetTimer();

    init();
    play();
})

