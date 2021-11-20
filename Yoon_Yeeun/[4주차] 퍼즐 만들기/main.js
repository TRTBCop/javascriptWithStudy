const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")
const imgButton = document.querySelector(".img-button")

const tileCount = 16

let tiles = [];
const dragged = {
    el: null,
    class: null,
    index: null
}

let image = "url('https://placeimg.com/400/400/any";
let countImage=0;

let isPlaying = false;
let timeInterval = 0;
let time = 0;

let DIFFICULTY_NORMAL=4;
let DIFFICULTY_EASY=2;
let DIFFICULTY_HARD =8;
let difficulty =DIFFICULTY_NORMAL;

setGame();

function setImage(){
    tiles.forEach(tile => {
        tile.style.background=`${image}${countImage}')`
        tile.style.backgroundPositionY=`-${tile.getAttribute("data-row")*(400/difficulty)}px`
        tile.style.backgroundPositionX=`-${tile.getAttribute("data-col")*(400/difficulty)}px`
    });
    countImage++
}


function setGame() {
    isPlaying = true;
    time = 0;
    container.innerHTML = "";
    gameText.style.display = 'none'
    clearInterval(timeInterval)

    tiles = createImageTiles();
    setImage();
    tiles.forEach(tile => container.appendChild(tile));
    setTimeout(() => {
        container.innerHTML = "";
        shuffle(tiles).forEach(tile => container.appendChild(tile))
        timeInterval = setInterval(() => {
            playTime.innerText = time;
            time++;
        }, 1000)
    }, 2000)
}

function createImageTiles() {
    const tempArray = [];
    Array(tileCount).fill().forEach((_, i) => {
        const li = document.createElement("li")
        li.setAttribute('data-index', i)
        li.setAttribute('data-col', String(i%difficulty))
        li.setAttribute('data-row', String(Math.floor(i/difficulty)));
        li.classList.add(`list${i}`);
        li.setAttribute('draggable', 'true');
        console.log(li)
        tempArray.push(li);
    })
    return tempArray;
}


function shuffle(array) {
    let index = array.length - 1;
    while (index > 0) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--
    }
    return array
}

function checkStatus() {
    const currentList = [...container.children]
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index)
    console.log("틀린 개수" + unMatchedList.length)
    if (unMatchedList.length === 0) {
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval)
    }//gamefinish
}


//events
container.addEventListener('dragstart', e => {
    if (!isPlaying) return;
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})

container.addEventListener('dragover', e => {
    e.preventDefault()
})

container.addEventListener('drop', e => {
    if (!isPlaying) return;
    const obj = e.target
    console.log(obj)

    if (obj.className !== dragged.class) {
        let originPlace;
        let isLast = false;

        if (dragged.el.nextSibling) {
            originPlace = dragged.el.nextSibling
        } else {
            originPlace = dragged.el.previousSibling
            isLast = true
        }
        const droppedIndex = [...obj.parentNode.children].indexOf(obj)
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkStatus();
})

startButton.addEventListener('click', () => {
    setGame()
})

imgButton.addEventListener('click',()=>{
    setImage()
})