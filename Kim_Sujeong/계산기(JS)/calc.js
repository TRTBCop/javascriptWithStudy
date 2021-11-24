// Constant
const scienCalcOps = ["+-","mod","exp","x^2","1/x","10^x","sin","cos","tan"];

// Dom Element
const textInput = document.querySelector("input[type='text']");
const buttonInput = document.querySelectorAll("form input[type='button']");
const openClipboard = document.querySelector(".button-box input[value='클립보드']");
const clipboard = document.querySelector(
    ".clipboard");
const clipUl = document.querySelector('.clipboard ul');

const openscienceCalc = document.querySelector(".button-box input[value='공학계산기']");
const scientificCalc = document.querySelector(".scientificCalc");
const scForm = document.querySelector(".scientificCalc form");

// Variable
let clip = [];

// 여러번 쓰기 귀찮아서 이벤트 다는 거 한번에 모음.
const size = buttonInput.length;
Array(size).fill().forEach((_,i)=>{
    const element = buttonInput[i];
    if(element.value==='C') {
        element.addEventListener('click',()=>textInput.value='');
        element.addEventListener('dblclick',()=>{
            // logic
            clip = [];
            // view 
            drawClipboard();
        });
    } else if(element.value==='=') {
        element.addEventListener('click',()=>{
            // logic
            clip.push(textInput.value);
            // view
            textInput.value=calculator(textInput.value);
            drawClipboard();
        });
    } else if (element.value === 'del'){
        element.addEventListener('click',()=> textInput.value = textInput.value.slice(0, -1));
    } else 
        element.addEventListener('click',()=>textInput.value+=element.value);
})

// Function
function calculator(expression){
    return eval(expression);
}

function drawClipboard(){
    clipUl.innerHTML = '';
    if(clip.length===0) {
        const li = document.createElement('li');
        li.innerText = `아직 계산 결과가 존재하지 않습니다.`;
        clipUl.appendChild(li);
    }
    else {
        clip.forEach(element => {
        const li = document.createElement('li');
        li.innerText = `${element} = ${calculator(element)}`;
        li.addEventListener('dblclick',()=> textInput.value=element);
        clipUl.appendChild(li);
        });
    }
}

// Event
openscienceCalc.addEventListener('click', ()=> scientificCalc.classList.toggle('hidden'));
openClipboard.addEventListener('click', ()=> {
    drawClipboard();
    clipboard.classList.toggle('hidden');
});