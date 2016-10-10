# imageSize

A node.js script that resizes images on-the-fly.

Specify a ROOT_DIR environment varialbe to tell this script where to find the images. Then include a

  /[width]x[height]/ 
  
directory in front of the image path you're requesting. The script uses [sharp](https://github.com/lovell/sharp) to resize the image to specified dimensions and return it. It's especially handy if you use this behind a CDN like CloudFront so you don't have to recreate the images for every request.
