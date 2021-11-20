const submit = document.querySelector(".submit");
const nicknameInput = document.querySelector("#nickname");

submit.addEventListener("click", enter);
nicknameInput.addEventListener("keypress",(e)=>{
    if(e.keyCode===13) enter();
});

function enter(){
    const nickname=nicknameInput.value;

}

