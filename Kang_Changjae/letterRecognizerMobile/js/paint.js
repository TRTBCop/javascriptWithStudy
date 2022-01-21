window.addEventListener('load', init, false);

let canvas, ctx, tool;
let socket = io();

function init() {
	canvas = document.getElementById("mainNote");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2.5;

	tool = new tool_pencil();

	canvas.addEventListener('mousedown', doEvent, false);
	canvas.addEventListener('mousemove', doEvent, false);
	canvas.addEventListener('mouseup', doEvent, false);

	canvas.addEventListener('touchstart', doEvent, false);
	canvas.addEventListener('touchmove', doEvent, false);
	canvas.addEventListener('touchend', doEvent, false);

	socket.on("connect", function(){
		console.log("Connected.")
	});

	socket.on("response", (data)=>{
		resultText.innerHTML = data;
		console.log("Get Response.");
	});
}

function tool_pencil() {
	let tool = this;
	this.started = false;

	this.mousedown = function(event) {
		ctx.beginPath()
		ctx.moveTo(event._x, event._y);
		tool.started = true;
	};
	this.mousemove = function(event) {
		if(tool.started) {
			ctx.lineTo(event._x, event._y);
			ctx.stroke();
		}
	};
	this.mouseup = function(event) {
		if(tool.started) {
			tool.started = false;
		}
	};

	this.touchstart = function(event) {
		ctx.beginPath()
		ctx.moveTo(event._x, event._y);
		tool.started = true;
	};
	this.touchmove = function(event) {
		if(tool.started) {
			ctx.lineTo(event._x, event._y);
			ctx.stroke();
		}
	};
	this.touchend = function(event) {
		if(tool.started) {
			tool.started = false;
		}
	};
}

function doEvent(event) {
	if( event.layerX || event.layerX == 0 ) {
		event._x = event.layerX;
		event._y = event.layerY;
	}
	else if( event.offsetX || event.offsetX == 0 ) {
		event._x = event.offsetX;
		event._y = event.offsetY;
	}
	else if( event.targetTouches[0] || event.targetTouches[0].pageX == 0 ) {
		let left = 0;
		let top = 0;
		let elem = document.getElementById('mainNote');

		while(elem) {
			left = left + parseInt(elem.offsetLeft);
			top = top + parseInt(elem.offsetTop);
			elem = elem.offsetParent;
		}
		event._x = event.targetTouches[0].pageX - left;
		event._y = event.targetTouches[0].pageY - top;
	}

	let func = tool[event.type];
	if(func) {
		func(event);
	}
}

function handleClearClick() {
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	resultText.innerHTML = "";
}
const clearBtn = document.getElementById("clearBtn");
if(clearBtn){
	clearBtn.addEventListener("click", handleClearClick, false);
}
function handleGoClick() {
	resultText.innerHTML = "Hmm..";
	socket.emit("request", canvas.toDataURL("image/png"));
	console.log("Requested.");
}
const goBtn = document.getElementById("goBtn");
if(goBtn){
	goBtn.addEventListener("click", handleGoClick, false);
}