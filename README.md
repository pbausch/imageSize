# imageSize

A node.js script that resizes images on-the-fly.

Specify a ROOT_DIR environment variable to tell this script where to find the images. Then include a

    /[width]x[height]/ 
  
directory in front of the image path you're requesting. The script uses [sharp](https://github.com/lovell/sharp) to resize the image to the specified dimensions and return it. It's especially handy if you use this behind a CDN like CloudFront so you don't have to resize the images with every request.
