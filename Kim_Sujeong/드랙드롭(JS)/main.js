// Dom Element
const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");
const tilesCnt = 16;

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

// functions
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

function setGame(){
    // (re) initialize
    time = 0;
    gameText.style.display = 'none';
    clearInterval(timeInterval);
    isPlaying = true;

    timeInterval = setInterval(()=>{
        playTime.innerText = time;
        time++;
    },1000)

    tiles = createImageTiles();
    tiles.forEach((tile)=>container.appendChild(tile))
    setTimeout(()=>{
        container.innerHTML="";
        shuffle(tiles).forEach((tile)=>container.appendChild(tile))

    },5000)
}

// create initial tile
function createImageTiles(){
    const tempArray = [];
    Array(tilesCnt).fill().forEach((_,i) =>{
        const li = document.createElement("li");
        li.setAttribute('data-index', i);
        li.classList.add(`list${i}`);
        li.setAttribute('draggable','true');
        tempArray.push(li);
    })
    return tempArray;
}

// shuffle image's pieces
function shuffle(arr){
    let index = arr.length-1; //마지막 인덱스 선택
    while(index>0){
        const randomIdx = Math.floor(Math.random()*(index+1));
        [arr[index],arr[randomIdx]] = [arr[randomIdx], arr[index]];
        index--;
    }
    return arr;
}



// Event
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

startButton.addEventListener("click", ()=>{
    setGame();
})