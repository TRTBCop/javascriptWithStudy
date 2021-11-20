// Constants
const GAME_START = "게임시작";
const GAME_RUNNING = "게임중";
const GAME_END = "게임종료";
const GAME_LOADING_KOR = "게임 로딩중..";
const GAME_LOADIND_ENG = "loading";
const INITIAL_WORDDISPLAY = "PRESS GAME START";
const FINAL_WORDDISPLAY = "Game-End !  your score is ";
const  GAME_TIME = 5;
const BLUE_HEART = "💙";
const BLACK_HEART ="🖤";
const HEART_COUNT =  5;

// Attribute
const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const heartBox = document.querySelector(".heart-box");
const heartBar = document.querySelector(".heart-bar");
const button = document.querySelector(".button");
const restartBtn = document.querySelector(".restartBtn");

// Variable
let words = [];
let correctNum = 0; // 맞은 개수
let hearts = HEART_COUNT; // 남은 하트수
let score = 0; // 실제 점수
let time = 5; // 시간
let isPlaying= false; // 게임 중인지 여부
let timeInterval; // 남은 시간 인터벌
let checkInterval; //  시간과 게임중 여부를 이용해 상태를 파악하는 checkStatus를 갱신해주는 인터벌

// Initialize
init();
function init(){
    // display a loading message & loading game
    buttonChange(GAME_LOADING_KOR);
    getWords();
    wordInput.addEventListener('input', chechMatch); 
    makeHeart(); // make initalize heart bar (처음엔 비어있기 때문)
}

// playing game
function run(){
    // 이미 실행중이면 누르지 실행이 안되도록 막는다.
    if(isPlaying) return;
    // 실행 셋팅
    isPlaying = true;
    // set word display
    wordDisplay.innerText = words[0];
    // set word input
    wordInput.focus();
    // set time
    time = GAME_TIME;
    timeInterval = setInterval(countDown,1000);
    // set score
    scoreDisplay.innerText = 0;
    // start check status interval
    checkInterval = setInterval(checkStatus,50);
    // set button
    buttonChange(GAME_RUNNING);
}

function reinit(){
    // reloading words
    buttonChange(GAME_LOADING_KOR);
    getWords();
    // time
    time = 0;
    timeDisplay.innerText = time;
    clearInterval(timeInterval);
    // score
    score = 0;
    scoreDisplay.innerText = score;
    // heart 
    heartBox.innerHTML="";
    hearts = HEART_COUNT;
    makeHeart();
    // check statuc interval
    clearInterval(checkInterval);

}

// check status
function checkStatus(){
    if (time===0){
        if(!isPlaying){ // 게임을 시작할 수 있는 상태가 되었음을 의미.
            buttonChange(GAME_START);
            clearInterval(checkInterval);
        }
        if (hearts==1){ // 하트가 한개 남은채로 시간이 0이된 케이스
            // minus heart
            hearts--;
            makeHeart();
            // finalize time
            clearInterval(timeInterval);
            // finalize word display
            wordDisplay.innerText = FINAL_WORDDISPLAY+score;
            // finalize button
            buttonChange(GAME_END);
            // quit checkInterval
            clearInterval(checkInterval);
        } else{
            // minus heart
            hearts--;
            makeHeart();
            // re-setting time 
            time = GAME_TIME;
            clearInterval(timeInterval);
            timeInterval = setInterval(countDown,1000);
            // re-setting word display
            wordDisplay.innerText = words[Math.floor( Math.random() * words.length)];
            // re-setting wordInput 
            wordInput.value = "";
            wordInput.focus();
        }
    }
}

// get words
function getWords(){
    // get word at random-word 
    axios.get('https://random-word-api.herokuapp.com/word?number=10000')
    .then(function (response) {
        // filtering
        response.data.forEach((word)=>{if(word.length < 10)  words.push(word);})
        // set start status
        wordDisplay.innerText = INITIAL_WORDDISPLAY;
        buttonChange(GAME_START);
    }) .catch(function (error) { console.log(error);})
}

// check matching
function chechMatch () {
    // if input value and display value are the same
    if(wordInput.value.toLowerCase() === wordDisplay.innerHTML.trim().toLowerCase()){
        // the input should be cleared
        wordInput.value=""; 
        // 게임중이 아니라면 input만 비우고 종료
        if(!isPlaying) return; 

        // 게임중이라면 여러 값들을 조정해줘야한다.
        // score control
        correctNum++; // 실제 맞은개수 증가
        score += time * correctNum * 10; // 점수 계산
        scoreDisplay.innerText = score; // 점수 표시
        // time control
        time = GAME_TIME;
        // word display control
        const randomIdx = Math.floor( Math.random() * words.length);
        wordDisplay.innerText = words[randomIdx];
    }
};

// time count down
function countDown(){
    time > 0 ? time-- : isPlaying = false;
    if(!isPlaying) clearInterval(timeInterval); 
    timeDisplay.innerText = time;
}

// change button's text
function buttonChange(text){
    // 입력받은 값을 button에 표시해주고,
    button.innerText =  text;
    // loading에 따라 css를 적용해줘야하기 때문에 classList에 상태에 따라추가를 해준다.
    text === GAME_START 
    ? button.classList.remove(GAME_LOADIND_ENG)
    : button.classList.add(GAME_LOADIND_ENG);
}

// make initial heart
function makeHeart(){
    let initialHeart = "";
    for (let index = 0; index < hearts; index++) {
        initialHeart += `<div class='heart-bar'>${BLUE_HEART}</div>`;
    }
    for (let index = 0; index < HEART_COUNT-hearts; index++) {
        initialHeart += `<div class='heart-bar'>${BLACK_HEART}</div>`;
    }
    heartBox.innerHTML =initialHeart;
}

// Events
wordInput.addEventListener('input', chechMatch);
button.addEventListener("click",run);
restartBtn.addEventListener("click",reinit);