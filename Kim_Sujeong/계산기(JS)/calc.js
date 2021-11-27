// Constant
const baiscOps = ['+','-','*','/'];

// Dom Element
const textInput = document.querySelector("input[type='text']");
const buttonInput = document.querySelectorAll("form input[type='button']");
const openClipboardBtn = document.querySelector(".button-box input[value='클립보드']");
const clipboard = document.querySelector(".clipboard");
const clipUl = document.querySelector('.clipboard ul');

const openscienceCalcBtn = document.querySelector(".button-box input[value='공학계산기']");
const scientificCalc = document.querySelector(".scientificCalc");
const scForm = document.querySelector(".scientificCalc form");

// Variable
let clip = [];

// 버튼 별 이벤트 설정
Array(buttonInput.length).fill().forEach((_,i)=>{
    // get a button element
    const element = buttonInput[i];
    // button C
    if(element.value==='C') {
        // one click -> delete calc input
        element.addEventListener('click',()=>textInput.value='');
        // double click -> delete clipboard list
        element.addEventListener('dblclick',()=>{
            clip = [];
            showClipboard();
        });
    // button =(result)
    } else if(element.value==='=') {
        // one click -> calculate and put in input box, add clipboard
        element.addEventListener('click',()=>{
            if(textInput.value!=='') {
                let justCameIn = textInput.value;
                let calculated = calculate(justCameIn);

                textInput.placeholder = calculated;
                textInput.value = '';
                
                addClipboard(justCameIn, calculated);
            }
        });
    // button del -> delete one word 
    } else if (element.value === 'del') element.addEventListener('click',()=> textInput.value = textInput.value.slice(0, -1));
    else if (element.value === '+-') element.addEventListener('click',()=> eChangeMPSign() );
    else if (element.value === '1/x') element.addEventListener('click',()=> eReciprocal() );
    else if (element.value === 'x!') element.addEventListener('click',()=> eFactorial() );
    else if (element.value === '%') element.addEventListener('click',()=> ePercent() );
    // other buttons -> put in input box
    else element.addEventListener('click',()=>textInput.value+=element.value);
})

// Function
// calculate expression
function calculate(expression){
    return eval(expression);
}
// calcFunc : find last +-*/
function findLastOps(expression){
    return Math.max(Math.max(expression.lastIndexOf('+'),expression.lastIndexOf('-')),
        Math.max(expression.lastIndexOf('*'),expression.lastIndexOf('/')));
}
// calcFunc : - -> + or + -> -
function eChangeMPSign(){
    let expression = textInput.value;
    let lastidx = findLastOps(expression);
    let unChangeArea = expression.slice(0,lastidx);
    let nowSign = expression.charAt(lastidx);
    let changeArea = expression.slice(lastidx+1,expression.length);
    textInput.value = lastidx===-1? -+expression : 
        nowSign==='-'?unChangeArea+'+'+changeArea:
        nowSign==='+'?unChangeArea+'-'+changeArea: 
        unChangeArea+nowSign+'(-'+changeArea+')';
}
// calcFunc : change x -> 1/x
function eReciprocal(){
    let expression = textInput.value;
    let lastidx = findLastOps(expression);
    let unChangeArea = expression.slice(0,lastidx);
    let nowSign = expression.charAt(lastidx);
    let changeArea = expression.slice(lastidx+1,expression.length);

    textInput.value =  lastidx===-1? '(1/'+expression+')':unChangeArea+nowSign+'(1/'+changeArea+')';
}
// calcFunc : factorial (x! = x*(x-1)*(x-2)...*1)
function eFactorial(){
    let expression = textInput.value;
    let lastidx = findLastOps(expression);
    let unChangeArea = expression.slice(0,lastidx);
    let nowSign = expression.charAt(lastidx);
    let changeArea = expression.slice(lastidx+1,expression.length);

    textInput.value = unChangeArea+nowSign+fact(changeArea);
    if(lastidx===-1) {
        let justCameIn = textInput.value;
        let calculated = calculate(justCameIn);
        textInput.placeholder = calculated;
        textInput.value = '';
        addClipboard(justCameIn, calculated);
    }
}
// calcFunc : percent (x% = 0.0X)
function ePercent(){
    let expression = textInput.value;
    let lastidx = findLastOps(expression);
    let unChangeArea = expression.slice(0,lastidx);
    let nowSign = expression.charAt(lastidx);
    let changeArea = expression.slice(lastidx+1,expression.length);

    if(lastidx===-1) {
        textInput.value = 0.01*parseInt(expression);
        let justCameIn = textInput.value;
        let calculated = calculate(justCameIn);
        textInput.placeholder = calculated;
        textInput.value = '';
        addClipboard(justCameIn, calculated);
    } else textInput.value = unChangeArea+nowSign+(0.01*parseInt(changeArea));
}
// sub-calcFunc : calculate factorial 
function fact(val){
    if(val<=1) return 1;
    return val*fact(val-1);
}
// add clipboard li
function addClipboard(justCameIn,calculated){
    const obj = {
        id : new Date(),
        text  : `${justCameIn} = ${calculated}`,
    }
    clip.push(obj);
    showClipboard();
}

// delete clipboard li
function deleteClipboard(e){
    const li = e.target.parentElement;
    clip = clip.filter((c)=>c.id!=li.id);
    showClipboard();
}

// draw li on clipboard ul
function showClipboard(){
    // if there are no result -> show message
    if(clip.length===0) {
        clipUl.innerHTML = '';
        const li = document.createElement('li');
        li.innerText = `아직 계산 결과가 존재하지 않습니다.`;
        clipUl.appendChild(li);
    // if result exist -> draw it
    } else{
        // initailize
        clipUl.innerHTML = '';
        clip.forEach(element => {
            // create elements
            const li = document.createElement('li');
            const span = document.createElement("span");
            const button = document.createElement("button");
            // add attributes and value
            li.id = element.id;
            button.innerText = "❌";
            span.innerText = element.text;
            button.addEventListener("click",deleteClipboard);
            // append them
            li.appendChild(button);
            li.appendChild(span);
            li.addEventListener('dblclick',()=> textInput.value=element.slice(0,element.indexOf('=')-1));
            clipUl.appendChild(li);
        });
    }
}

// Event
openscienceCalcBtn.addEventListener('click', ()=> scientificCalc.classList.toggle('hidden'));
openClipboardBtn.addEventListener('click', ()=>clipboard.classList.toggle('hidden'));
