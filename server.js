fs = require('fs');
http = require('http');
url = require('url');
sharp = require('sharp');

function return404(r) {
	console.log('not found');
    r.writeHead(404, {"Content-Type": "text/plain"});
    r.end("404 Not found");
	return;
}

function hasAllowedExtension(file, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(file);
}

http.createServer(function(req, res){
	var request = url.parse(req.url, true);
	var action = request.pathname;
	
	console.log('action = ' + action);
	
	// Does this request contain an image action?
	var regex = /\/(\d{1,3})x(\d{1,3})\//g;
	result = regex.exec(action);
	if (!result) {
		return404(res);
		return;
	}
	var actionDir = result[0];
	var widthValue = parseInt(result[1]);
	var heightValue = parseInt(result[2]);
	
	// Reset the request directory
	action = action.replace(actionDir,"/").replace("/img","");
	reqFile = process.env.ROOT_DIR + action;
	
	console.log('file = ' + reqFile);
		
	// Is this an image request?
	if (!hasAllowedExtension(reqFile, ['.jpg', '.JPG'])) {
		return404(res);
		return;
	}
	
	// Does the image file exist?
	try {
	    fs.accessSync(reqFile, fs.F_OK);
	} 
	catch (e) {
		return404(res);
		return;
	}
	
	// Resize the image according to the action
	sharp(process.env.ROOT_DIR + action)
	  .resize(widthValue,heightValue)
	  .sharpen()
	  .toBuffer()
	  .then(function(outputBuffer) {
			res.writeHead(200, {'Content-Type': 'image/jpg' });
	 		res.end(outputBuffer, 'binary');	    
	  });
}).listen(8080);
console.log('server started on 8080');