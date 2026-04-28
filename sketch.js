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

let radius = 95;

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

  // erase only the hovered part of the real typed text
  noStroke();
  fill(0);
  circle(mouseX, mouseY, radius * 2.1);

  // draw transformed type particles only where the real type was erased
  for (let p of particles) {
    p.update();
    if (p.isActive()) {
      p.show();
    }
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

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    let y = startY + i * lineHeight;

    let points = font.textToPoints(lines[i], marginX, y, fontSize, {
      sampleFactor: 0.24,
      simplifyThreshold: 0
    });

    for (let pt of points) {
      particles.push(new TypeParticle(pt.x, pt.y));
    }
  }
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

class TypeParticle {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = random(2.2, 4.5);
  }

  isActive() {
    return dist(mouseX, mouseY, this.home.x, this.home.y) < radius * 1.25;
  }

  update() {
    let d = dist(mouseX, mouseY, this.home.x, this.home.y);

    if (d < radius) {
      let away = p5.Vector.sub(this.pos, createVector(mouseX, mouseY));
      away.normalize();

      let strength = map(d, 0, radius, 7, 0);
      away.mult(strength);
      this.vel.add(away);
    }

    let back = p5.Vector.sub(this.home, this.pos);
    back.mult(0.08);
    this.vel.add(back);

    this.vel.mult(0.82);
    this.pos.add(this.vel);
  }

  show() {
    let d = dist(mouseX, mouseY, this.home.x, this.home.y);

    let w = map(d, 0, radius, 20, this.size, true);
    let h = map(d, 0, radius, 6, this.size, true);

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
  buildText();
}
