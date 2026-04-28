let font;
let particles = [];

let displayText = "FIONA\nNEW\nTESTAMENT";
let fontSize;
let mode = 0;

let interactionRadius = 150;

function preload() {
  font = loadFont("FionaNewTestament.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont(font);
  generateTextParticles();
}

function draw() {
  background(0);

  for (let p of particles) {
    p.behaviors();
    p.update();
    p.show();
  }

  drawModeLabel();
}

function generateTextParticles() {
  particles = [];

  fontSize = min(width * 0.14, 150);

  let lines = displayText.split("\n");
  let lineHeight = fontSize * 0.9;

  let totalHeight = lines.length * lineHeight;
  let startY = height / 2 - totalHeight / 2 + fontSize * 0.75;

  for (let j = 0; j < lines.length; j++) {
    let line = lines[j];

    let bounds = font.textBounds(line, 0, 0, fontSize);
    let x = width / 2 - bounds.w / 2;
    let y = startY + j * lineHeight;

    let points = font.textToPoints(line, x, y, fontSize, {
      sampleFactor: 0.16,
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
    this.pos = createVector(x + random(-20, 20), y + random(-20, 20));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.size = random(3, 7);
    this.noiseOffset = random(1000);
    this.colorOffset = random(255);
  }

  behaviors() {
    let mouse = createVector(mouseX, mouseY);

    let arrive = this.arrive(this.home);
    let react = this.react(mouse);

    arrive.mult(1.0);
    react.mult(1.7);

    this.applyForce(arrive);
    this.applyForce(react);

    if (mode === 1) {
      this.applyForce(this.wander());
    }

    if (mode === 2) {
      this.applyForce(this.wave());
    }
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    let speed = 8;

    if (d < 100) {
      speed = map(d, 0, 100, 0, 8);
    }

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.7);

    return steer;
  }

  react(mouse) {
    let desired = p5.Vector.sub(this.pos, mouse);
    let d = desired.mag();

    if (d < interactionRadius) {
      desired.normalize();

      let strength = map(d, 0, interactionRadius, 12, 0);
      desired.mult(strength);

      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(1.8);

      return steer;
    }

    return createVector(0, 0);
  }

  wander() {
    let angle = noise(this.noiseOffset + frameCount * 0.01) * TWO_PI * 2;
    let force = p5.Vector.fromAngle(angle);
    force.mult(0.08);
    return force;
  }

  wave() {
    let force = createVector(
      sin(frameCount * 0.04 + this.home.y * 0.02),
      cos(frameCount * 0.04 + this.home.x * 0.02)
    );

    force.mult(0.12);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.82);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

    let w = map(d, 0, interactionRadius, 26, this.size, true);
    let h = map(d, 0, interactionRadius, 8, this.size, true);

    push();
    translate(this.pos.x, this.pos.y);

    let angle = atan2(this.vel.y, this.vel.x);
    rotate(angle);

    noStroke();

    if (mode === 0) {
      fill(255);
    } else if (mode === 1) {
      fill(
        180 + sin(frameCount * 0.03 + this.colorOffset) * 75,
        120 + sin(frameCount * 0.02 + this.colorOffset) * 80,
        255
      );
    } else {
      fill(255);
    }

    ellipse(0, 0, w, h);

    pop();
  }
}

function mousePressed() {
  mode++;
  if (mode > 2) {
    mode = 0;
  }
}

function drawModeLabel() {
  push();
  fill(255, 120);
  noStroke();
  textFont("Arial");
  textSize(12);
  textAlign(RIGHT, BOTTOM);

  let label = "mode: oval distortion";
  if (mode === 1) label = "mode: color scatter";
  if (mode === 2) label = "mode: wave field";

  text(label, width - 28, height - 24);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateTextParticles();
}
