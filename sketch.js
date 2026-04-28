let font;
let particles = [];

let effect = 0;
let totalEffects = 6;

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
    p.behave();
    p.update();
    p.show();
  }

  drawEffectName();
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

    let points = font.textToPoints(lines[i], marginX, startY + i * lineHeight, fontSize, {
      sampleFactor: 0.55, //here 
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
    this.acc = createVector(0, 0);

    this.size = random(1.2, 2.2);
    this.seed = random(1000);
    this.angle = random(TWO_PI);
  }

  behave() {
    let homeForce = p5.Vector.sub(this.home, this.pos);
    homeForce.mult(0.065);
    this.applyForce(homeForce);

    if (effect === 0) this.mouseRepel();
    if (effect === 1) this.wave();
    if (effect === 2) this.orbit();
    if (effect === 3) this.noiseDrift();
    if (effect === 4) this.explode();
    if (effect === 5) this.magnet();
  }

  mouseRepel() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();
    let radius = 115;

    if (d < radius) {
      dir.normalize();
      let strength = map(d, 0, radius, 8, 0);
      dir.mult(strength);
      this.applyForce(dir);
    }
  }

  wave() {
    let waveX = sin(frameCount * 0.04 + this.home.y * 0.035) * 0.45;
    let waveY = cos(frameCount * 0.04 + this.home.x * 0.035) * 0.45;
    this.applyForce(createVector(waveX, waveY));
    this.mouseRepel();
  }

  orbit() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();
    let radius = 170;

    if (d < radius) {
      let tangent = createVector(-dir.y, dir.x);
      tangent.normalize();
      tangent.mult(map(d, 0, radius, 2.2, 0));
      this.applyForce(tangent);
    }
  }

  noiseDrift() {
    let angle = noise(this.seed, frameCount * 0.01) * TWO_PI * 3;
    let force = p5.Vector.fromAngle(angle);
    force.mult(0.18);
    this.applyForce(force);
  }

  explode() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();
    let radius = 160;

    if (d < radius) {
      dir.normalize();
      let strength = map(d, 0, radius, 14, 0);
      dir.mult(strength);
      this.applyForce(dir);
    }
  }

  magnet() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(mouse, this.pos);
    let d = dir.mag();
    let radius = 220;

    if (d < radius) {
      dir.normalize();
      let strength = map(d, 0, radius, 2.8, 0);
      dir.mult(strength);
      this.applyForce(dir);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);

    if (effect === 4) {
      this.vel.mult(0.88);
    } else {
      this.vel.mult(0.82);
    }

    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

    let w = this.size;
    let h = this.size;

    if (effect === 0) {
      w = map(d, 0, 140, 16, this.size, true);
      h = map(d, 0, 140, 5, this.size, true);
    }

    if (effect === 1) {
      w = 2 + sin(frameCount * 0.08 + this.seed) * 1.5;
      h = 8 + cos(frameCount * 0.08 + this.seed) * 4;
    }

    if (effect === 2) {
      w = 10;
      h = 2.5;
    }

    if (effect === 3) {
      w = 2.5;
      h = 2.5;
    }

    if (effect === 4) {
      w = map(d, 0, 180, 22, this.size, true);
      h = map(d, 0, 180, 3, this.size, true);
    }

    if (effect === 5) {
      w = map(d, 0, 220, 3, 14, true);
      h = map(d, 0, 220, 3, 4, true);
    }

    push();
    translate(this.pos.x, this.pos.y);

    if (effect === 1) {
      rotate(sin(frameCount * 0.04 + this.seed) * PI);
    } else {
      rotate(this.vel.heading());
    }

    noStroke();
    fill(255);

    if (effect === 3) {
      rectMode(CENTER);
      rect(0, 0, w, h);
    } else {
      ellipse(0, 0, w, h);
    }

    pop();
  }
}

function mousePressed() {
  effect++;
  if (effect >= totalEffects) {
    effect = 0;
  }
}

function drawEffectName() {
  let names = [
    "repel",
    "wave",
    "orbit",
    "noise",
    "explode",
    "magnet"
  ];

  push();
  fill(255, 120);
  noStroke();
  textFont("Arial");
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  text("effect " + (effect + 1) + " / " + totalEffects + " — " + names[effect], width - 22, height - 18);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makeParticles();
}
