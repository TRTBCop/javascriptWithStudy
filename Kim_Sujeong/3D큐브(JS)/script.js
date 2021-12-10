let deg = 0;
setInterval(()=>{
    deg=deg-1;
    document.querySelector(".cube").style.transform = `rotateX(${deg}deg)`
},10);