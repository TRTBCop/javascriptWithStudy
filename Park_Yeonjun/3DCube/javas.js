let deg = 0;
setInterval(()=>{
    deg = deg-90;
    document.querySelector(".cube").style.transform = 'rotateX(' +deg + 'deg)';
}, 1000);

const faceBook = document.querySelector(".cube img:nth-child(1)")
const twitter = document.querySelector(".cube img:nth-child(2)")
const youTube = document.querySelector(".cube img:nth-child(3")
const instagram = document.querySelector(".cube img:nth-child(4)")

function clickFacebook(){
    location = "https://ko-kr.facebook.com/";
}
function clickTwitter(){
    location = "https://twitter.com/";
}
function clickYouTube(){
    location = "https://www.youtube.com/";
}
function clickInstagram(){
    location = "https://www.instagram.com/?hl=ko";
}



faceBook.addEventListener("click", clickFacebook);
twitter.addEventListener("click", clickTwitter);
youTube.addEventListener("click", clickYouTube);
instagram.addEventListener("click", clickInstagram);

