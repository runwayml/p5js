// Copyright (C) 2018 Runway ML Examples
// 
// This file is part of Runway ML Examples.
// 
// Runway-Examples is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Runway-Examples is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Runway AI Examples.  If not, see <http://www.gnu.org/licenses/>.
// 
// ===========================================================================
// RUNWAY
// www.ruwnayml.com

let img;
let raw = new Image();

var nose= {x:0, y:0};
var rightEye = {x:0, y:0};
var leftEye = {x:0, y:0};
var leftEar = {x:0, y:0};
var rightEar = {x:0, y:0};
var leftShoulder = {x:0, y:0};
var rightShoulder = {x:0, y:0};
var leftElbow = {x:0, y:0};
var rightElbow = {x:0, y:0};
var leftWrist = {x:0, y:0};
var rightWrist = {x:0, y:0};
var leftHip = {x:0, y:0};
var rightHip = {x:0, y:0};
var leftKnee = {x:0, y:0};
var rightKnee = {x:0, y:0};
var leftAnkle = {x:0, y:0};
var rightAnkle = {x:0, y:0};

let keypoints;
let humans; 
let positions;

let posx; 
let posy

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
      print("sending image")
      sendImage();
    }
  });

  // Get the current frame and send it to Runway using the Canvas API
  function sendImage() {
    ctx.drawImage(video, 0, 0, 300, 280);
    // Send to Runway the current element in the canvas
    socket.emit('query', {
       image: canvas.toDataURL('image/jpeg'),
    });
  }

  // Start the loop: send an image, wait for response, send another one...
  function start() {
    shouldLoop = true;
    sendImage()
    print("sending image")
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


function newDrawing(data){
  background(0)
    //create title
  textSize(20);
  fill(255);
  textAlign(CENTER);
  text("PoseNet Demo: Sending Images via p5.js to Runway.", width/2, 40);
 
  if (data != null) {
    humans = data["poses"];
    console.log(humans)
    for(let h = 0; h < humans.length; h++) {
        human = humans[h];
        keypoints = human.keypoints;
      // Now that we have one human, let's draw its body parts
      for (let k = 0; k < keypoints.length; k++) {
          body_part = keypoints[k];
          positions = body_part["position"];
        // Body parts are relative to width and weight of the input
         posx = positions.x;
         posy = positions.y;
         console.log(posy)
         fill(255, 0, 0);
         ellipse(posx+500, posy+300, 10, 10);
      }
    }
  }
}