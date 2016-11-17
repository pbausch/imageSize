var fs = require('fs');
var http = require('http');
var url = require('url');
var sharp = require('sharp');
var etag = require('etag');

function return404(r,e) {
	console.log(e);
    r.writeHead(404, {"Content-Type": "text/plain"});
    r.end("404 Not found");
	return;
}

function hasAllowedExtension(file, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(file);
}

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}

http.createServer(function(req, res){
	var request = url.parse(req.url, true);
	var action = request.pathname;
	
	// Does this request contain an image action?
	var regex = /\/(\d{1,3})x(\d{1,3})\//g;
	result = regex.exec(action);
	if (!result) {
		return404(res,'no dimensions found in request');
		return;
	}
	var actionDir = result[0];
	var widthValue = parseInt(result[1]);
	var heightValue = parseInt(result[2]);
	
	// Reset the request directory
	action = action.replace(actionDir,"/");
	reqFile = process.env.ROOT_DIR + action;
	
	// Get the extension
	var extension = reqFile.split('.').pop();
	
	// Is this an image request?
	if (!hasAllowedExtension(reqFile, ['.png', '.jpg', '.JPG'])) {
		return404(res,'request did not have allowed extension');
		return;
	}
	
	// Does the image file exist?
	if (!fileExists(reqFile)) {
		return404(res,'image file was not found: ' + reqFile);
		return;
	}
	
	// Get the Last Modified time
	var stats = fs.statSync(reqFile);
	var mtime = new Date(util.inspect(stats.mtime));
	
	// Resize the image according to the action
	sharp(process.env.ROOT_DIR + action)
	  .resize(widthValue,heightValue)
	  .sharpen()
	  .toBuffer()
	  .then(function(outputBuffer) {
			res.statusCode = 200;
			res.setHeader("Cache-Control", "public, max-age=31556952000");
		    res.setHeader("Expires", new Date(Date.now() + 31556952000).toUTCString());
			res.setHeader("Last-Modified", mtime.toUTCString());
			res.setHeader("Content-Type", "image/" + extension);
	 		res.end(outputBuffer, 'binary');	    
	  });
}).listen(8080);
console.log('server started on 8080');