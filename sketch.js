let font;
let particles = [];

let textString = "Fiona New Testament";
let fontSize = 130;

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

  fontSize = min(width * 0.11, 140);

  let bounds = font.textBounds(textString, 0, 0, fontSize);
  let x = width / 2 - bounds.w / 2;
  let y = height / 2 + bounds.h / 2;

  let points = font.textToPoints(textString, x, y, fontSize, {
    sampleFactor: 0.18,
    simplifyThreshold: 0
  });

  for (let pt of points) {
    particles.push(new Particle(pt.x, pt.y));
  }
}

class Particle {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = random(3, 6);
  }

  react() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();

    let radius = 120;

    if (d < radius) {
      dir.normalize();
      let strength = map(d, 0, radius, 8, 0);
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

    let w = map(d, 0, 150, 20, this.size, true);
    let h = map(d, 0, 150, 7, this.size, true);

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
