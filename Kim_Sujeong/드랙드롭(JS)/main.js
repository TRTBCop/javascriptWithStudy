// Constant

const easy = {
    keyword: "list4_",
    tilesCnt : 4,
}
const normal = {
    keyword : "list16_",
    tilesCnt : 16,
}
const hard ={
    keyword : "list25_",
    tilesCnt : 25,
}

// Dom Element
const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");
const initialImg = document.querySelector(".initial-img");
const options = document.querySelector(".options");


// Variable
let tiles = [];
const dragged ={
    el : null,
    class : null,
    index : null,
}
let isPlaying = false;
let timeInterval = null;
let time = 0;
let difficulty = normal;

// =================== FUNCTION >>
// 원위치에 있지않는 조각이 있는지 찾는 함수
function checkStatus(){
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child,index)=> Number(child.getAttribute("data-index")) !== index);
    if(unMatchedList.length ===0){
        // game end
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval);
    }
}
// 게임 셋팅을 하는 함수
function setGame(){
    // (re) initialize
    // value setting
    time = 0;
    clearInterval(timeInterval);
    isPlaying = true;
    // view setting
    playTime.innerText = 'Game will be start...';
    gameText.style.display = 'none';
    initialImg.style.display = 'none';
    // container setting
    container.innerHTML="";
    container.className = "image-container";
    container.classList.add(difficulty.keyword);
    // tiles setting
    tiles = createImageTiles();
    tiles.forEach((tile)=>container.appendChild(tile))
    setTimeout(()=>{
        shuffle(tiles).forEach((tile)=>container.appendChild(tile));
        timeInterval = setInterval(()=>{
            playTime.innerText = time;
            time++;
        },1000)
    },5000);
}

// set game difficulty
function setDifficulty(){
    //  setGame을 부르기전에 input으로 받은 난이도로 난이도를 셋팅함.
    const difficultyNodeList = document.getElementsByName('difficulty');
    difficultyNodeList.forEach((node)=>{
        if(node.checked){
            if(node.value==='easy'){
                difficulty = easy;
            } else if(node.value==='normal'){
                difficulty = normal;
            } else if(node.value==='hard'){
                difficulty = hard;
            }
        }
    })
}


// create initial tile
function createImageTiles(){
    // 리턴시 li들을 담아 내보낼 배열
    const tempArray = [];
    // li들을 만들고 기본 앳븃 등을 셋팅해줌.
    Array(difficulty.tilesCnt).fill().forEach((_,i) =>{
        const li = document.createElement("li");
        li.style.backgroundImage = `url("https://placeimg.com/400/400/tech")`;
        li.setAttribute('data-index', i);
        li.classList.add(`${difficulty.keyword}${i}`);
        li.setAttribute('draggable','true');
        tempArray.push(li);
    })
    return tempArray;
}

// shuffle image's pieces
function shuffle(arr){
    let index = arr.length-1; 
    while(index>0){
        const randomIdx = Math.floor(Math.random()*(index+1));
        [arr[index],arr[randomIdx]] = [arr[randomIdx], arr[index]];
        index--;
    }
    return arr;
}



// =================== EVENT >>
// when piece drag start
container.addEventListener('dragstart', (e)=>{
    if(!isPlaying) return;
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    // 이벤트가 발생한 타겟(e.target)의 부모노드가 가진 자식들(li들)을 그냥 가져오면 Object임.
    // 이를 [... 오브젝트]를 사용하면 배열로 변환할 수 있다.
    // ...을 하면 얘가 가지고있는 기본 원소가 불러진다.
    // []를 이용해 배열로 만듬.
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})
// when draging event  over the Image
container.addEventListener('dragover', (e)=>{
    // 어떤 사진 위에서 드롭이 발생하는데 dragover에 preventDefault를 안하면 drop이 발생안함.
    e.preventDefault(); 
})
// when drop(finish draging) event occurs
container.addEventListener('drop', (e)=>{
    const obj = e.target;

    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false;
    
        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling;
        }else{
            originPlace = dragged.el.previousSibling;
            isLast = true;
        }

        const droppedIdx = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIdx ? obj.before(dragged.el) :  obj.after(dragged.el);
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkStatus();
})
// when we start the game
startButton.addEventListener("click", ()=>{
    setDifficulty();
    setGame();
})