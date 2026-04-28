let font;
let particles = [];

let aboutText =
  "Fiona Huang is a graphic designer and inventor.\n\n" +
  "She uses design to think. Not to decorate. Sometimes the work looks like design. Sometimes it doesn’t. This is intentional.\n\n" +
  "She makes books, images, and systems that behave. They might make sound. They might wait. They might do something slightly wrong. This is also intentional.\n\n" +
  "Recently, she has been working with emotions, hate, attachment, and self-regard, treating them as material. Not to solve them. Just to organize them.\n\n" +
  "Her work is playful. Her life is, too. She loves animals, traveling, Edward Hopper, and Salvador Dalí. She hates idiots. Every day she wakes up and feels an exquisite joy—the joy of being Fiona. It shows in the work.";

let fontSize;
let marginX;
let startY;
let lineHeight;
let interactionRadius = 110;

function preload() {
  font = loadFont("FionaNewTestament.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  generateParticles();
}

function draw() {
  background(0);

  for (let p of particles) {
    p.behaviors();
    p.update();
    p.show();
  }
}

function generateParticles() {
  particles = [];

  fontSize = min(width * 0.028, height * 0.035);
  fontSize = constrain(fontSize, 13, 28);

  marginX = width * 0.08;
  startY = height * 0.12;
  lineHeight = fontSize * 1.45;

  let maxWidth = width * 0.84;
  let words = aboutText.split(" ");
  let lines = [];
  let currentLine = "";

  textFont(font);
  textSize(fontSize);

  for (let word of words) {
    let testLine = currentLine + word + " ";

    if (word.includes("\n\n")) {
      let parts = word.split("\n\n");
      currentLine += parts[0];
      lines.push(currentLine);
      lines.push("");
      currentLine = parts[1] + " ";
    } else if (textWidth(testLine) > maxWidth) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }

  lines.push(currentLine);

  let totalHeight = lines.length * lineHeight;
  startY = height / 2 - totalHeight / 2 + fontSize;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.trim() === "") continue;

    let x = marginX;
    let y = startY + i * lineHeight;

    let points = font.textToPoints(line, x, y, fontSize, {
      sampleFactor: 0.19,
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
    this.pos = createVector(x + random(-10, 10), y + random(-10, 10));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(2.2, 4.5);
  }

  behaviors() {
    let arrive = this.arrive(this.home);
    let mouseForce = this.reactToMouse();

    arrive.mult(1.1);
    mouseForce.mult(2.0);

    this.applyForce(arrive);
    this.applyForce(mouseForce);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    let speed = 7;

    if (d < 90) {
      speed = map(d, 0, 90, 0, 7);
    }

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.6);

    return steer;
  }

  reactToMouse() {
    let mouse = createVector(mouseX, mouseY);
    let desired = p5.Vector.sub(this.pos, mouse);
    let d = desired.mag();

    if (d < interactionRadius) {
      desired.normalize();

      let strength = map(d, 0, interactionRadius, 10, 0);
      desired.mult(strength);

      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(1.5);

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
  generateParticles();
}
