const INPUT_WINDOW = document.querySelector("div form input[type=text]")
const INPUT_NUMBERS = document.querySelectorAll("div form input[type=button].number")
const INPUTS = document.querySelectorAll("div form input[type=button]")

const MEMORY_BUTTON = document.querySelector("div form input.memory[value='M']")
const RECALL_BUTTON = document.querySelector("div form input.memory[value='R']")
let memoryValue = ''

const CLEAR_BUTTON = document.querySelector("div form input[type=button][value='C']")
const CLEAR_ONE_BUTTON = document.querySelector("div form input[type=button].clear.one")

clear()

//숫자 버튼 클릭 이벤트 설정.
for (let i = 0; i < INPUT_NUMBERS.length; i++) {
    let input = INPUT_NUMBERS[i];
    let inputValue = input.getAttribute("value")
    input.setAttribute('onclick', `append("${inputValue}")`)
}

MEMORY_BUTTON.setAttribute('onclick', 'memory()')
RECALL_BUTTON.setAttribute('onclick', 'recall()')
CLEAR_BUTTON.setAttribute('onclick', 'clear()')
CLEAR_ONE_BUTTON.setAttribute('onclick', 'erase()')


//입력 기본 기능
function getText() {return INPUT_WINDOW.getAttribute("value")}
function setText(text) {INPUT_WINDOW.setAttribute("value", text)}
function clear() {
    setText('')
    console.log('clear')
}
function append(inputValue) {
    let prevInputValue = getText()
    setText(prevInputValue + inputValue)
}

//한 글자 지우기 기능
function erase(){
    let prevInputValue = getText()
    setText(prevInputValue.substr(0,prevInputValue.length-1))
}

//메모리 기능
function recall() {setText(memoryValue)}
function memory() {memoryValue = getText()}














