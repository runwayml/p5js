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

let raw = new Image();

// connect to runway via HTTP
let url = 'http://localhost:8000/query';


//define variables
let input_text;
let post_image;
let send_btn;
let newimg;
let img;


function setup(){
    //create the canvas 
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("#p5canvas")
    cnv.style('z-index', '-1');
    cnv.position(0, 30);

    createMenu()

    //create a text input with P5 Dom Library
    input_text = createInput('');
    input_text.position(0, 100);
    input_text.input(sendText);
    input_text.addClass("form-control");
    input_text.parent("input")
}

function draw(){
  //draw the input image from handleFile
  if(img){
    fill(255);
    imageMode(CENTER);
    image(img, width/2, 250, 300, 300);
  }
}

function createMenu(){
    //a title for our sketch
    textSize(20);
    fill(255);
    textAlign(CENTER);
    text("ATTN GAN Demo: Sending Text via p5.js to Runway", width/2, 40);
}

function newDrawing(data){
  //get the results form Runway
  //if there is data with a key of result
  //create an image
    if(data && data.result) {
      newimg = createImg(data.result);
      newimg.attribute('width', 400)
      newimg.attribute('height', 400)
      newimg.position(500, 280);
    }
}


function sendText() {
  //send the text to Runway via HTTP. The this.value is the value
  //of the input text
    console.log('you are typing: ', this.value());

    postData = { caption: this.value()};

  httpPost(url, 'json', postData, function(result) {
    newDrawing(result)
  });
}