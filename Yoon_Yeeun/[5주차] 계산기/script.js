const INPUT_WINDOW = document.querySelector("div form input[type=text]")
const INPUT_NUMBERS = document.querySelectorAll("div form input[type=button].number")
const INPUTS = document.querySelectorAll("div form input[type=button]")

const MEMORY_BUTTON = document.querySelector("div form input.memory[value='M']")
const RECALL_BUTTON = document.querySelector("div form input.memory[value='R']")
let memoryValue = ''
let hasDots=[false]

const CLEAR_BUTTON = document.querySelector("div form input[type=button][value='C']")
const CLEAR_ONE_BUTTON = document.querySelector("div form input[type=button].clear.one")

const DOT_BUTTON = document.querySelector("div form input.number[value='.']")
const CALC_BUTTON = document.querySelector("div form input[value='=']")

clear()
hasDots=[false]

//숫자 버튼 클릭 이벤트 설정.
for (let i = 0; i < INPUT_NUMBERS.length; i++) {
    let input = INPUT_NUMBERS[i];
    let inputValue = input.value
    MEMORY_BUTTON.onclick=function(){append(inputValue)}
}

MEMORY_BUTTON.onclick=function(){memory()}
RECALL_BUTTON.onclick=function(){recall()}
CLEAR_BUTTON.onclick=function(){clear()}
CLEAR_ONE_BUTTON.onclick=function(){erase()}
DOT_BUTTON.onclick=function(){dot()}
CALC_BUTTON.onclick=function(){calc()}



//입력 기본 기능
function getText() {return INPUT_WINDOW.value}
function setText(text) {INPUT_WINDOW.value=text}
function clear() {
    setText('')
    console.log('clear')
}
function append(inputValue) {
    let prevInputValue = getText()
    setText(prevInputValue + inputValue)
}
function dot(){
    if(!hasDots[length]){
        append('.')
        hasDots[length]=true;
    }
}
function calc(){
    let prevInputValue = getText()
    if(prevInputValue==='119.') call119()
    setText(eval(prevInputValue)===undefined?'':eval(getText()))
}

//한 글자 지우기 기능
function erase(){
    let prevInputValue = getText()
    setText(prevInputValue.substr(0,prevInputValue.length-1))
}

//메모리 기능
function recall() {setText(memoryValue)}
function memory() {memoryValue = getText()}

//신고 기능
function call119(){
    window.location.href='http://119.go.kr/Center119/regist.do?certify=R';
}














