var readline = require('readline');
var fs = require('fs');
var http = require('http');

var alpha = {};

readline.createInterface({
  input: fs.createReadStream('dict.txt','r'),
  output: false
})
.on("line", function(ln) {
	var first = ln.charAt(0).toLowerCase();
	alpha[first] = alpha[first] || [];
	alpha[first].push(ln);
})
.on("close", function() {
	http.createServer(function(request, response) {

	if(request.url === "/") {
		response.writeHead(200, {
			"Content-type":"text/html"
		});
		return fs.createReadStream("./index.html").pipe(response);
	}

	var alph = request.url.toLowerCase().split("/char/")[1];
	
	if(!alph) {
		return response.end("");
	}
	
	var out = [];
	alph.split('').forEach(function(a) {
		out.push(alpha[a][Math.floor(Math.random() * alpha[a].length)]);
	});
	
	response.writeHead(200, {
		"Content-type" : "application/json"
	})
	response.end(JSON.stringify(out));

}).listen(8080)});



