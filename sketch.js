let font;

let aboutText =
  "Fiona Huang is a graphic designer and inventor.\n\n" +
  "She uses design to think. Not to decorate. Sometimes the work looks like design. Sometimes it doesn’t. This is intentional.\n\n" +
  "She makes books, images, and systems that behave. They might make sound. They might wait. They might do something slightly wrong. This is also intentional.\n\n" +
  "Recently, she has been working with emotions, hate, attachment, and self-regard, treating them as material. Not to solve them. Just to organize them.\n\n" +
  "Her work is playful. Her life is, too. She loves animals, traveling, Edward Hopper, and Salvador Dalí. She hates idiots. Every day she wakes up and feels an exquisite joy—the joy of being Fiona. It shows in the work.";

let lines = [];
let particles = [];

let fontSize;
let marginX;
let startY;
let lineHeight;

let radius = 90;

function preload() {
  font = loadFont("FionaNewTestament.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  buildText();
}

function draw() {
  background(0);

  drawNormalText();

  for (let p of particles) {
    p.update();
    p.show();
  }
}

function buildText() {
  lines = [];
  particles = [];

  fontSize = constrain(width * 0.026, 15, 28);
  marginX = width * 0.08;
  lineHeight = fontSize * 1.45;

  textFont(font);
  textSize(fontSize);

  let maxWidth = width * 0.84;
  let paragraphs = aboutText.split("\n\n");

  for (let para of paragraphs) {
    let words = para.split(" ");
    let line = "";

    for (let word of words) {
      let testLine = line + word + " ";

      if (textWidth(testLine) > maxWidth) {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    }

    lines.push(line);
    lines.push("");
  }

  let totalHeight = lines.length * lineHeight;
  startY = height / 2 - totalHeight / 2 + fontSize;
}

function drawNormalText() {
  fill(255);
  noStroke();
  textFont(font);
  textSize(fontSize);
  textAlign(LEFT, BASELINE);

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], marginX, startY + i * lineHeight);
  }
}

function mouseMoved() {
  createDistortion(mouseX, mouseY);
}

function createDistortion(mx, my) {
  for (let i = 0; i < 12; i++) {
    let x = mx + random(-radius, radius);
    let y = my + random(-radius, radius);

    particles.push(new TextParticle(x, y));
  }

  if (particles.length > 700) {
    particles.splice(0, 100);
  }
}

class TextParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.5, 3));
    this.life = 255;
    this.size = random(3, 9);
    this.w = random(8, 26);
    this.h = random(3, 8);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.92);
    this.life -= 8;
  }

  show() {
    if (this.life <= 0) return;

    noStroke();
    fill(255, this.life);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    ellipse(0, 0, this.w, this.h);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildText();
}
