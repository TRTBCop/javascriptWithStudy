let express = require("express");
let app = express();
let server = require("http").createServer(app);
let fs = require("fs");
var io = require("socket.io")(server);

app.use("/css", express.static("css"));
app.use("/js", express.static("js"));

app.get("/", function(req, res) {
 	res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
	console.log("Listening on port 8080");
});

io.on("connection", function(socket) {
	address = socket.request.connection.remoteAddress;
	console.log("Connected: "+socket.id+"("+address+")");
	socket.on("request", (reqData)=>{
		console.log("Get Request: "+socket.id+"("+address+")");
		matches = reqData.match(/^data:.+\/(.+);base64,(.*)$/);
		fs.writeFileSync(
			"./python/image/"+socket.id+"."+matches[1],
			Buffer.from(matches[2], "base64")
		);
		let rst = require("child_process").spawn(
			"python3",
			[
				"python/letterCnnPredictor.py",
				"python/model/letterCnnClassifier",
				"python/data/intToStrMap.bin",
				"python/image/"+socket.id+"."+matches[1]
			]
		);
		rst.stdout.on("data", function(respData) {
			console.log(respData.toString());
			io.emit("response_"+socket.id, respData.toString());
			console.log("Responsed: "+socket.id+"("+address+")");
		});
	});
});