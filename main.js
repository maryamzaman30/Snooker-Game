/* This file is main.js where all the global variables are initalized & all the setup, preloading & drawing is done
   And also COMMENTARY is written below the code */

// Importing modules from the Matter.js physics engine
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// Variables to store width & height of table     
let tableWidth;
let tableHeight;
let dZoneCenterX, dZoneCenterY, dZoneRadius; // Variables to store the center coordinates & radius of the D-Zone

let ballDiameter; // Variable to store the diameter of the balls
let pocketSize; // Variable to store the size of the pockets

// Arrays for storing
let redBalls = [];
let colorBalls = [];
let cushionBodies = [];

let mode = 0; // 0: table only, 1: starting positions, 2: random positions (reds only), 3: random positions (reds and colored balls), 4: Extension 
let modeSelected = false; // Mode is initially 0 & this variable checks if a mode has been selected or not

let cueBall; // Variable to store the cue ball
let cueBallPlaced = false; // Cue ball is not initially placed & this variable check if the cue ball has been placed
let cueStickPower = 0; // Variable to store the power of the cue stick, lowest power is 0
let maxCueStickPower = 10; // Variable to store the maximum power of the cue stick, max. power is 10
let cueStickLength = 100; // Variable to store the length of the cue stick
let isMousePressed = false; // To check if the mouse is pressed, mouse is not initially pressed.
let isMouseReleased = false; // To check if the mouse is released

// Minor part of Extention Mode
let cushionColorChangeTime = 200; // Time in milliseconds for how long the cushion stays a different color
let cushionOriginalColor = [0, 80, 0]; // Original color of the cushion
let cushionHitColor = [0, 255, 0]; // Color of the cushion when hit
let cushionHitTimes = new Map(); // Map to track when cushions were hit

const cornerRadius = 30; // Just a random variable used for pockets & GravityPockets

let collisionMessage = ""; // Initialize an empty string for the collision message
let lastColoredBall = null; // Variable to store the last colored ball for the error of 2 consective balls pocketed.

// Extention Mode
let showExtensionModeInstructions = false; // To check if the instructions for mode 4 should be shown, instructions are not initially shown
let score = 50; // Initialize score to 50
let gravityPockets; // Variable to store the gravity pockets
let pocketBehaviors = []; // Array to store the behaviors of the pockets

// Minor part of Extention Mode
let hitSound; // Variable to store the sound when the cue ball collides with other balls
let tableSound; // Variable to store the sound of the cushions on table

function preload() 
{
  // Preloading the sounds (Minor part of Extention Mode)
  hitSound = loadSound("poolballhit.mp3"); // Source: https://freesound.org/people/juskiddink/sounds/108615/
  tableSound = loadSound("table.mp3"); // Source: https://freesound.org/people/locky_Y/sounds/733159/
}

function setup() 
{
  createCanvas(1000, 550);

  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0; // Setting gravity to 0 so that the balls can move around without falling down the screen

  // Setting the width & hieght of table (maintaining a 2:1 ratio)
  tableWidth = 900; 
  tableHeight = tableWidth / 2;

  // Using the formulas given in midterm brief
  ballDiameter = tableWidth / 36; 
  pocketSize = ballDiameter * 1.5;

  // Setting the center of D zone to place cueball
  dZoneDiameter = tableHeight / 3; 
  dZoneRadius = dZoneDiameter / 2;
  dZoneCenterX = tableWidth / 5 + 130; 
  dZoneCenterY = tableHeight / 2 - 5;
  
  // Store & define the behaviour's positions of Gravity Pockets
  gravityPockets = [
    { x: cornerRadius + 40, y: cornerRadius + 40, behavior: randomBehavior() },
    { x: tableWidth - cornerRadius + 60, y: cornerRadius + 40, behavior: randomBehavior() },
    { x: cornerRadius + 40, y: tableHeight - cornerRadius + 62, behavior: randomBehavior() },
    { x: tableWidth - cornerRadius + 60, y: tableHeight - cornerRadius + 62, behavior: randomBehavior() },
    { x: tableWidth / 2 + 50, y: cornerRadius + 37, behavior: randomBehavior() },
    { x: tableWidth / 2 + 50, y: tableHeight - cornerRadius + 65, behavior: randomBehavior() }
  ];

  displayMessages(); // Display the main message on table to ask user to select one of the modes

  createTableBorderConstraints(); // created a constraint for brown color table border
  createCushionConstraints(); // Creating cushions contraints so balls bounce off the cushions

  // Adding a collision start event listener to the engine
  Matter.Events.on(engine, 'collisionStart', handleCollision); // Overall collisions
  Matter.Events.on(engine, 'collisionStart', detectCueBallCollision); // Handles cue ball collisions to display the last activity of cue ball
}

function draw() 
{
  clear(); // Clear the canvas first
  drawTable(); // Draws the table, cushions, pockets

  if (!modeSelected) // If mode is 0 then Display the main message
  {
    displayMessages();
  } 
  else 
  {
    Engine.update(engine); // Else, Updating the physics engine, draw balls & display the last activity of cue ball
    drawBalls();
    displayCollisionMessage();

    if (!cueBallPlaced && !showExtensionModeInstructions) // If cue ball is not placed & Extension mode instructions not displayed then,
    {
      displayCueBallPlacementMessage(); // Tell the user to place the ball in center of D zone.
    }

    if (mode === 4) // If Extension mode is chosen then show its instructions first
    {
      if (showExtensionModeInstructions) 
      {
        displayExtensionModeInstructions();
      } 
      else // Then use gravity pockets instead of normal pockets & display the score
      {
        applyPocketForces();
        displayScore();
      }
    }
  }

  if (cueBallPlaced && cueBall) // If cue ball is placed & cue ball is not null
  {
    drawCueStick(); // Then draw the cue stick
  }
}

/////////////////////////////////////////// COMMENTARY ///////////////////////////////////////////

/*
app design:
The application is a snooker game designed using the Matter.js physics engine and the p5.js for rendering. The application includes 
features to enhance the visual appeal and realism of the game. These include drawing the table, balls, and pockets, and the cushions. 
The cushions are implemented as static bodies in the Matter.js world, while pockets are implemented using p5.js and the balls are 
dynamic bodies that can move and collide with each other and the static bodies. The table and balls have been made realistic as 
shade has been added to table baize and cushions by "setGradient()" function and light reflection has been added to the balls by 
drawing small ellipses over them.

why you used a mouse-based only cue function - how does it work:
The mouse-based cue function is a key feature of the application. It was chosen for its intuitive nature and ease of use, providing 
a more immersive and interactive experience for the user. The user can aim the cue ball by moving the mouse, and the power of the shot 
is determined by the distance between the mouse and the cue ball. This design choice resembles the real-life action of controlling a 
cue stick, making the interaction more engaging for users. 

Discuss your extension:
Extension in this game is the concept of gravity pockets. These pockets exhibit random gravitational behaviors, either attracting 
or repelling balls within a specific range, either acting like blackhole or warmhole. TThe gravitational forces are implemented by 
applying a force to each ball that is within a certain range of a pocket. The direction and magnitude of the force depend on the 
distance between the ball and the pocket and the behavior of the pocket. Random behavior is the unpredictable part of this extension 
and the challenging part is that if any of the pockets attract a cue ball, then the player loses 10 points. Apart from the challenge 
and unpredictability, I have also made the game easier by drawing and implementing an aimer that helps players strategize their shots. 
I have also made the game fun by implementing cushions changing colour when any ball collides with them and adding sounds for ball 
and cushion collisions. I consider the aimer, sounds, and color-changing cushions to be minor parts of the extension, as these fun 
and easy elements balance the challenging and unpredictable elements in the actual extension.

Why it is a unique idea:
The gravity pockets extension is a unique idea because it introduces an element of unpredictability and strategy to the game. 
In traditional snooker, pockets are static and do not influence the movement of the balls. However, with gravity pockets, each 
pocket can either attract or repel balls, adding a new layer of complexity to the game. This feature requires players to not only 
aim and shoot with precision, but also to anticipate the effects of the gravity pockets and adjust their strategies accordingly. 
Players must consider the additional forces acting on the balls. This innovative twist enhances the gameplay, making it more dynamic 
and engaging. 

Word count: 485 (Excluding subtitles like "app design:", "why you used a mouse-based only cue function - how does it work:" etc)

Resources used:
1. p5.js - https://p5js.org/
2. Matter.js - https://brm.io/matter-js/

In the code I implemented almost everything by myself, taking help from the documentations. For setting a gradient effect
on table I took help from URL I have mentioned in table.js
*/