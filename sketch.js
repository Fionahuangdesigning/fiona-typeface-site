let font;
let particles = [];

let aboutText =
  "Fiona Huang is a graphic designer and inventor.\n\n" +
  "She uses design to think. Not to decorate. Sometimes the work looks like design. Sometimes it doesn’t. This is intentional.\n\n" +
  "She makes books, images, and systems that behave. They might make sound. They might wait. They might do something slightly wrong. This is also intentional.\n\n" +
  "Recently, she has been working with emotions, hate, attachment, and self-regard, treating them as material. Not to solve them. Just to organize them.\n\n" +
  "Her work is playful. Her life is, too. She loves animals, traveling, Edward Hopper, and Salvador Dalí. She hates idiots. Every day she wakes up and feels an exquisite joy—the joy of being Fiona. It shows in the work.";

let lines = [];
let fontSize;
let marginX;
let startY;
let lineHeight;

function preload() {
  font = loadFont("FionaNewTestament.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  makeParticles();
}

function draw() {
  background(0);

  for (let p of particles) {
    p.react();
    p.returnHome();
    p.update();
    p.show();
  }
}

function makeParticles() {
  particles = [];
  lines = [];

  fontSize = constrain(width * 0.023, 12, 23);
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

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    let x = marginX;
    let y = startY + i * lineHeight;

    let points = font.textToPoints(lines[i], x, y, fontSize, {
      sampleFactor: 0.25,
      simplifyThreshold: 0
    });

    for (let pt of points) {
      particles.push(new Particle(pt.x, pt.y));
    }
  }
}

class Particle {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = random(1.8, 3.5);
  }

  react() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();

    let radius = 105;

    if (d < radius) {
      dir.normalize();
      let strength = map(d, 0, radius, 7, 0);
      dir.mult(strength);
      this.vel.add(dir);
    }
  }

  returnHome() {
    let homeForce = p5.Vector.sub(this.home, this.pos);
    homeForce.mult(0.06);
    this.vel.add(homeForce);
  }

  update() {
    this.vel.mult(0.85);
    this.pos.add(this.vel);
  }

  show() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

    let w = map(d, 0, 140, 16, this.size, true);
    let h = map(d, 0, 140, 5, this.size, true);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    noStroke();
    fill(255);
    ellipse(0, 0, w, h);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makeParticles();
}
