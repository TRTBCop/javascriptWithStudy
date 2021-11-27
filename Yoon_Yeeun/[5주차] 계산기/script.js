const INPUT_WINDOW = document.querySelector("div form input[type=text]")
const INPUT_NUMBERS = document.querySelectorAll("div form input[type=button].number")
const INPUTS = document.querySelectorAll("div form input[type=button]")

const MEMORY_BUTTON = document.querySelector("div form input.memory[value='M']")
const RECALL_BUTTON = document.querySelector("div form input.memory[value='R']")
let memoryValue = ''

const CLEAR_ONE_BUTTON = document.querySelector("div form input[type=button].clear.one")
const CLEAR_BUTTON = document.querySelector("div form input[type=button][value='C']")

const DOT_BUTTON = document.querySelector("div form input.number[value='.']")
let hasDots;

const OPERATORS = ['/', '*', '+', '-'];

let endsWithOperator, endsWithNumber;
let operatorCount;

const OPERATOR_BUTTONS = document.querySelectorAll("div form input[type=button].operator")

const CALC_BUTTON = document.querySelector("div form input[value='=']")

initialize()
//숫자 버튼 클릭 이벤트 설정.
for (let i = 0; i < INPUT_NUMBERS.length; i++) {
    let input = INPUT_NUMBERS[i];
    let inputValue = input.value
    input.onclick = function () {
        appendNumber(inputValue)
    }
}

//연산자 버튼 클릭 이벤트 설정.
for (let j = 0; j < OPERATOR_BUTTONS.length; j++) {
    let operator = OPERATOR_BUTTONS[j];
    let operatorValue = operator.value;
    if (operatorValue !== '=') operator.onclick = function () {
        appendOperator(operatorValue)
    }
}

MEMORY_BUTTON.onclick = function () {
    memory()
}
RECALL_BUTTON.onclick = function () {
    recall()
}
CLEAR_BUTTON.onclick = function () {
    initialize()
}
CLEAR_ONE_BUTTON.onclick = function () {
    erase()
}
DOT_BUTTON.onclick = function () {
    dot()
}
CALC_BUTTON.onclick = function () {
    calc()
}


function initialize() {
    clear()
    operatorCount = 0;
    hasDots = [false]
    endsWithOperator = false
    endsWithNumber = false
}

//입력 기본 기능
function getText() {
    return INPUT_WINDOW.value
}

function setText(text) {
    INPUT_WINDOW.value = text
}

function clear() {
    setText('')
    console.log('clear')
}

function append(inputValue) {
    let prevInputValue = getText()
    setText(prevInputValue + inputValue)
}

function appendNumber(value) {
    if (endsWithOperator) hasDots[hasDots.length]=false//바로 앞이 연산자이므로, 새로운 숫자가 시작되었다.
    endsWithNumber = true;
    endsWithOperator = false;
    append(value)
}

function appendOperator(value) {
    if (!endsWithNumber && !endsWithOperator) return;//시작이 operator일 수는 없다.
    if (endsWithOperator) erase()//바로 앞이 연산자이므로, 그 연산자를 지운다.
    operatorCount++;
    endsWithNumber = false;
    endsWithOperator = true;
    append(value)
}

function dot() {
    if (!hasDots[hasDots.length - 1] && endsWithNumber) {
        append('.')
        hasDots[hasDots.length - 1] = true;
    }
}

function calc() {
    let prevInputValue = getText()
    if (prevInputValue === '119.') call119()
    let calcResult=eval(prevInputValue) === undefined ? '' : eval(getText());
    initialize()
    setText(calcResult)
    endsWithNumber=true;
}


//한 글자 지우기 기능
function erase() {
    console.log("\n")
    console.log("\n")
    let prevInputValue = getText()
    if (prevInputValue.length === 1) {
        initialize();
        return;
    }
    let lastValue = prevInputValue.substr(prevInputValue.length - 2, 1)
    let removeValue = prevInputValue.substr(prevInputValue.length - 1, 1)
    console.log(removeValue+"를 지워서, "+lastValue+"가 이제 마지막임.")
    if (endsWithNumber && OPERATORS.includes(lastValue)) {//숫자 지우고 남은 값의 마지막이 연산자.(하나의 숫자를 싹 지웠음.)
        console.log('숫자 다 지움.')
        hasDots.pop()
        endsWithNumber = false
        endsWithOperator = true
    } else if(endsWithNumber&&removeValue==="."){
        hasDots[hasDots.length-1]=false
    }else if (endsWithOperator && OPERATORS.includes(removeValue)) {//지운 값이 연산자. 그럼 남은 값이 당연히 숫자.
        console.log('연산자 지움.')
        operatorCount--
        endsWithNumber = true
        endsWithOperator = false
    }

    console.log('숫자 개수 '+hasDots.length)
    console.log('연산자 개수'+operatorCount)
    console.log('소수점 현황 '+hasDots)

    console.log(endsWithNumber?"숫자로 끝남":"숫자로 안 끝남")
    console.log(endsWithOperator?"연산자로 끝남":"연산자로 안 끝남")

    setText(prevInputValue.substr(0, prevInputValue.length - 1))
}

//메모리 기능
function recall() {
    initialize()
    endsWithNumber = true;
    endsWithOperator = false;
    setText(memoryValue)
}

function memory() {
    if (operatorCount !== 0) alert('경고! 계산을 마친 후에만 저장이 가능합니다.')
    else if (getText().length === 0) alert('경고! 저장할 값이 없습니다.')
    else memoryValue = getText()
}

//신고 기능
function call119() {
    window.location.href = 'http://119.go.kr/Center119/regist.do?certify=R';
}














