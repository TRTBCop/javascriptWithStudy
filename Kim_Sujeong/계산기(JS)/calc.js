// Dom Element
const textInput = document.querySelector("input[type='text']");
const buttonInput = document.querySelectorAll("input[type='button'");

// 여러번 쓰기 귀찮아서 만듦.
const size = buttonInput.length;
Array(size).fill().forEach((_,i)=>{
    const element = buttonInput[i];
    if(element.value==='C') element.addEventListener('click',()=>textInput.value='');
    else if(element.value==='=') element.addEventListener('click',()=>textInput.value=eval(textInput.value));
    else element.addEventListener('click',()=>textInput.value+=element.value);
})