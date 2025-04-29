// Import Matter.js parts we need
const { Engine, World, Bodies, Mouse, MouseConstraint } = Matter;

// Variables for physics engine and world
let engine;
let world;

// Variable for the ground body
let ground;

// List of words that will randomly fall
let words = [
  "APPLY TO JOBS",
  "MEDITATE",
  "REFINE PORTFOLIO",
  "WORKOUT",
  "YOGA",
  "HEALTHY FOOD",
  "WRITE MY WEEKLY SUBSTACK",
  "LEARN CODING",
  "MASTER AI TOOLS",
  "THERAPHY",
  "UPDATE MY PORTFOLIO",
  "START SIDE PROJECT",
  "FACETIME SHIVANI",
  "FACETIME PIA",
  "POST ON INSTAGRAM",
  "FINISH BOOK",
  "TRACK MY PROTEIN",
  "10K STEPS",
  "BREATH",
];

let font; // (Correct lowercase)

let fallingWords = []; // Array to store falling words

function preload() {
  font = loadFont("ITC Avant Garde Gothic Bold Condensed.otf");
}

let palette = [
  "#94B6EF",
  "#7AA590",
  "#0B3B39",
  "#C4B045",
  "#BF0200",
  "#8E1B52",
  "#F2A3CF",
  "#A584AC",
];

function setup() {
  let canvas = createCanvas(800, 600); // <-- STORE canvas here
  textFont(font);

  engine = Engine.create();
  world = engine.world;

  let groundOptions = {
    isStatic: true,
    friction: 1,
  };
  ground = Bodies.rectangle(width / 2, height - 10, width, 20, groundOptions);
  World.add(world, ground);

  '¡¡¡'

  let canvasMouse = Mouse.create(canvas.elt); // <-- Now this works
  canvasMouse.pixelRatio = pixelDensity();

  let mouseOptions = {
    mouse: canvasMouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  };

  let mConstraint = MouseConstraint.create(engine, mouseOptions);
  World.add(world, mConstraint);
}

function draw() {
  background(255);
  Engine.update(engine);

  // Draw ground
  fill(255);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width, 20);

  // Add a new word every 40 frames
  if (frameCount % 40 === 0) {
    let w = new FlexibleWord(random(100, width - 100), -30, random(words));

    fallingWords.push(w);
  }

  // Show and update all falling words
  for (let i = fallingWords.length - 1; i >= 0; i--) {
    let fw = fallingWords[i];
    fw.show();
  }
}

// ------ FLEXIBLE WORD ------
class FlexibleWord {
  constructor(x, y, str) {
    this.letters = [...str]; // Turn string into array of characters
    this.bodies = [];
    this.constraints = [];
    this.opacity = 255;
    this.color = color(random(palette));

    let letterSize = 28;
    let spacing = letterSize * 0.8;

    let options = {
      restitution: 1,
      friction: 1,
      density: 0.1,
    };

    // Create a body for each letter
    for (let i = 0; i < this.letters.length; i++) {
      let b = Bodies.circle(x + i * spacing, y, letterSize * 0.4, options);
      this.bodies.push(b);
      World.add(world, b);

      // Create constraints between letters
      if (i > 0) {
        let c = Matter.Constraint.create({
          bodyA: this.bodies[i - 1],
          bodyB: this.bodies[i],
          length: spacing,
          stiffness: 1,
        });
        this.constraints.push(c);
        World.add(world, c);
      }
    }
  }

  show() {
    textSize(28);
    textAlign(CENTER, CENTER);
    fill(red(this.color), green(this.color), blue(this.color), this.opacity);
    noStroke();

    for (let i = 0; i < this.bodies.length; i++) {
      let pos = this.bodies[i].position;
      let angle = this.bodies[i].angle;

      push();
      translate(pos.x, pos.y);
      rotate(angle);
      text(this.letters[i], 0, 0);
      pop();
    }
  }
}
