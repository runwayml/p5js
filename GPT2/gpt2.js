let raw = new Image();

let url = 'http://localhost:8000/query';


let send_btn;
let input_text;
let output_text;
let prompt_value;
let input_slider;
let slider_val;
let text_display;


function setup(){
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("#p5canvas")
    cnv.style('z-index', '-1');
    cnv.position(0, 30);

    createMenu()

    input_text = createInput('');
    input_text.position(0, 100);
    input_text.input(myInputEvent);
    input_text.addClass("form-control");
    input_text.parent("input")

    input_slider = createSlider(0, 120, 20, 1);
    input_slider.position(0, 240);
    input_slider.parent("input")
    input_slider.addClass("slider")
}


function createMenu(){
   

    send_btn = createButton("Send Text");
    send_btn.mousePressed(sendText);
    send_btn.addClass("btn btn-lg btn-primary");
    send_btn.parent("#send_btn");
    send_btn.position(0, 150);
}

function draw(){
  if(output_text){
    textAlign(LEFT);
    textSize(12);
    fill(255);
    strokeWeight(1)
    text(output_text, 300, 300, 800, height);
  }
}

function newDrawing(data){
    if(data && data.text) {
      output_text = data.text;
    }
}

function myInputEvent() {
  prompt_value = this.value()
}

function sendText() {

   console.log(prompt_value);
   var slider_val = input_slider.value();
   console.log(slider_val);

   postData = { prompt: prompt_value, seed: slider_val};
  

  httpPost(url, 'json', postData, function(result) {
    clear()
    newDrawing(result)
  });
}