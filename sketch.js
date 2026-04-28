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
let interactionRadius = 95;

function preload() {
  font = loadFont("FionaNewTestament.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  generateLayout();
}

function draw() {
  background(0);

  drawReadableText();

  // black circle hides normal text only under the mouse
  noStroke();
  fill(0);
  circle(mouseX, mouseY, interactionRadius * 2.1);

  for (let p of particles) {
    p.behaviors();
    p.update();

    if (p.isNearMouse()) {
      p.show();
    }
  }
}

function generateLayout() {
  particles = [];
  lines = [];

  fontSize = min(width * 0.027, height * 0.034);
  fontSize = constrain(fontSize, 14, 27);

  marginX = width * 0.08;
  lineHeight = fontSize * 1.45;

  let maxWidth = width * 0.84;
  let paragraphs = aboutText.split("\n\n");

  textFont(font);
  textSize(fontSize);

  for (let paragraph of paragraphs) {
    let words = paragraph.split(" ");
    let currentLine = "";

    for (let word of words) {
      let testLine = currentLine + word + " ";

      if (textWidth(testLine) > maxWidth) {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }

    lines.push(currentLine);
    lines.push("");
  }

  let totalHeight = lines.length * lineHeight;
  startY = height / 2 - totalHeight / 2 + fontSize;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim() === "") continue;

    let x = marginX;
    let y = startY + i * lineHeight;

    let points = font.textToPoints(line, x, y, fontSize, {
      sampleFactor: 0.22,
      simplifyThreshold: 0
    });

    for (let pt of points) {
      particles.push(new Particle(pt.x, pt.y));
    }
  }
}

function drawReadableText() {
  fill(255);
  noStroke();
  textFont(font);
  textSize(fontSize);
  textAlign(LEFT, BASELINE);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      text(lines[i], marginX, startY + i * lineHeight);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(2.2, 4.2);
  }

  isNearMouse() {
    return dist(mouseX, mouseY, this.home.x, this.home.y) < interactionRadius * 1.2;
  }

  behaviors() {
    let arrive = this.arrive(this.home);
    let mouseForce = this.reactToMouse();

    arrive.mult(1.2);
    mouseForce.mult(2.1);

    this.applyForce(arrive);
    this.applyForce(mouseForce);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    let speed = 6;
    if (d < 80) {
      speed = map(d, 0, 80, 0, 6);
    }

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.55);
    return steer;
  }

  reactToMouse() {
    let mouse = createVector(mouseX, mouseY);
    let desired = p5.Vector.sub(this.pos, mouse);
    let d = desired.mag();

    if (d < interactionRadius) {
      desired.normalize();

      let strength = map(d, 0, interactionRadius, 9, 0);
      desired.mult(strength);

      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(1.4);
      return steer;
    }

    return createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.84);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

    let w = map(d, 0, interactionRadius, 18, this.size, true);
    let h = map(d, 0, interactionRadius, 6, this.size, true);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(atan2(this.vel.y, this.vel.x));

    noStroke();
    fill(255);
    ellipse(0, 0, w, h);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateLayout();
}
