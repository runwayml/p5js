let raw = new Image();

let url = 'http://localhost:8000/query';

let post_image;
let send_btn;
let newimg;
let img;
let input_image;

function setup(){
    //create the canvas
    cnv = createCanvas(500, 500);
    cnv.parent("#the_canvas")
    cnv.position(0, 30);

    createMenu()

    input_image = createFileInput(handleFile);
    input_image.position(80, 60);
}

function draw(){
  //draw the input image from handleFile
  if(img){
    image(img, 80, 80, 500, 500);
  }
}

function createMenu(){
   // create the send button
    send_btn = createButton("SEND IMAGE");
    send_btn.mousePressed(sendImages);
    send_btn.parent("#send_btn");
}

function handleFile(file) {
  //handle fle input
  if (file.type === 'image') {
    img = loadImage(file.data);
  } else {
    img = null;
  }
}

function newDrawing(data){
  //create and draw the new image
    if(data && data.image) {
      newimg = createImg(data.image);
      newimg.attribute('width', 400)
      newimg.attribute('height', 400)
      newimg.position(700, 80);
    }
}

function sendImages(){
    sendImage();
}

function sendImage() {
  //convert image to base64 and post image to Runway
    img.loadPixels();
    post_image = img.canvas.toDataURL('image/jpeg'),

    postData = { image: post_image};

  httpPost(url, 'json', postData, function(result) {
    newDrawing(result)
  });
}