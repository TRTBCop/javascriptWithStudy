// Constant
const baiscOps = ['+','-','*','/'];
const scienCalcOps = ["+-","mod","exp","x^2","1/x","10^x","sin","cos","tan"];

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
    const element = buttonInput[i];
    if(element.value==='C') {
        element.addEventListener('click',()=>textInput.value='');
        element.addEventListener('dblclick',()=>{
            clip = [];
            showClipboard();
        });
    } else if(element.value==='=') {
        element.addEventListener('click',()=>{
            if(textInput.value!=='') {
                let justCameIn = textInput.value;
                let calculated = calculate(justCameIn);

                textInput.placeholder = calculated;
                textInput.value = '';
                
                addClipboard(justCameIn, calculated);
            }
        });
    } else if (element.value === 'del'){
        element.addEventListener('click',()=> textInput.value = textInput.value.slice(0, -1));
    } else {
        element.addEventListener('click',()=>textInput.value+=element.value);
    }
})

// Function
function calculate(expression){
    return eval(expression);
}

function addClipboard(justCameIn,calculated){
    const obj = {
        id : new Date(),
        text  : `${justCameIn} = ${calculated}`,
    }
    clip.push(obj);
    showClipboard();
}

function deleteClipboard(e){
    const li = e.target.parentElement;
    clip = clip.filter((c)=>c.id!=li.id);
    showClipboard();
}

function showClipboard(){
    if(clip.length===0) {
        clipUl.innerHTML = '';
        const li = document.createElement('li');
        li.innerText = `아직 계산 결과가 존재하지 않습니다.`;
        clipUl.appendChild(li);
    } else{
        clipUl.innerHTML = '';
        console.log(clip.length);
        clip.forEach(element => {
            const li = document.createElement('li');
            const span = document.createElement("span");
            const button = document.createElement("button");
        
            li.id = element.id;
            button.innerText = "❌";
            span.innerText = element.text;
            button.addEventListener("click",deleteClipboard);
        
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
