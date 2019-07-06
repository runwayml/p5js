let img;
let raw = new Image();

var socket = io.connect('http://127.0.0.1:3000/');

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  // Get the DOM elements
  var status = document.getElementById('status');
  var startBtn = document.getElementById('start');
  var stopBtn = document.getElementById('stop');
  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;
  var shouldLoop = false;

  // Get the user's camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      });
  }

  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
  });

  // When there is new data coming in, update the log element
  socket.on('data', function(data) {
    if (shouldLoop) {
      sendImage();
    }
  });

  // Get the current frame and send it to Runway using the Canvas API
  function sendImage() {
    ctx.drawImage(video, 0, 0, 300, 280);
    // Send to Runway the current element in the canvas
    socket.emit('query', {
        input: canvas.toDataURL('image/jpeg'),
    });
  }

  // Start the loop: send an image, wait for response, send another one...
  function start() {
    shouldLoop = true;
    sendImage()
  }
  // Stop the loop
  function stop() {
    shouldLoop = false;
  }

  // Listen to start and stop event
  startBtn.addEventListener('click', start, false);
  stopBtn.addEventListener('click', stop, false);

  // Get the DOM log element
  var status = document.getElementById('status');
  var log = document.getElementById('log');
  
  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
  });
  // When there is a data event, update the log element
  socket.on('data', newDrawing);
});

function setup(){
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('p5canvas');
    cnv.style('z-index', '-1');
    cnv.position(0, 0);
    background(0);
}

function draw(){
    fill(255, 0, 0);
    rect(200, 200, 20, 20);
}

function newDrawing(data){
    if(data && data.output) {
      raw.src = data.output;
      raw.onload = function() {
          img = createImage(raw.width, raw.height);
          img.drawingContext.drawImage(raw, 0, 0);
          image(img, 600, 0, 700, 700); 
        }
    }
}