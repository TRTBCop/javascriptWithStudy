
const ghost = document.querySelector('.ghost')

document.body.addEventListener("mousemove", function (e) {
    console.log("길이 "+ghost.style.width+" 높이"+ghost.style.height)
    ghost.style.left = (e.pageX-(ghost.offsetWidth/2)) + 'px'
    ghost.style.top = (e.pageY-(ghost.offsetHeight/2)) + 'px'
})
