/* This file is modes.js & it manages the positions of balls except cue ball based on modes selected */

function resetBalls() // A function named resetBalls
{
  // Create red balls at a specific starting position & assign them to the redBalls array
  redBalls = createRedBalls(width / 2 + ballDiameter * 7, height / 2);
  // Create color balls & assign them to the colorBalls array
  colorBalls = createColorBalls();
}

function randomizeRedBalls() // A function named randomizeRedBalls
{
  // Create 15 random red balls & assign them to the redBalls array
  redBalls = createRandomBalls(15, 'red');
  // Create color balls & assign them to the colorBalls array
  colorBalls = createColorBalls();
}

function randomizeAllBalls() // A function named randomizeAllBalls
{
  // Create 15 random red balls & assign them to the redBalls array
  redBalls = createRandomBalls(15, 'red');
  // Create 6 random color balls & assign them to the colorBalls array
  colorBalls = createRandomBalls(6, 'color');
}

function createRedBalls(startX, startY) // A function named createRedBalls that takes a starting x & y position as parameters
{
  // Initialize an empty array for the balls
  let balls = [];
  // Loop over each row up to 5
  for (let row = 0; row < 5; row++) 
  {
    // Loop over each column up to the current row
    for (let col = 0; col <= row; col++) 
    {
      // Create a new red ball at a specific position & add it to the balls array
      balls.push(new Ball(
        startX + (row * ballDiameter * Math.sqrt(3) / 2),
        startY - (row * ballDiameter / 2) + (col * ballDiameter),
        'red'
      ));
    }
  }
  return balls; // Return the balls array
}

function createColorBalls() // A function named createColorBalls
{
  // Return an array of new color balls at specific positions
  return [
    new Ball(tableWidth / 3 + 50, height / 2 - tableHeight / 4, 'green'),
    new Ball(tableWidth / 3 + 50, height / 2, 'brown'),
    new Ball(tableWidth / 3 + 50, height / 2 + tableHeight / 4, 'yellow'),
    new Ball(width / 2, height / 2, 'blue'),
    new Ball(width / 2 + ballDiameter * 6, height / 2, 'pink'),
    new Ball(width / 2 + 350, height / 2, 'black')
  ];
}

function createRandomBalls(count, type) // A function named createRandomBalls that takes a count & a type as parameters
{
  // Initialize an empty array for the balls
  let balls = [];
  // Loop over each index up to the count
  for (let i = 0; i < count; i++) 
  {
    // Determine the color based on the type and the index
    let color = type === 'red' ? 'red' : ['green', 'brown', 'yellow', 'blue', 'pink', 'black'][i % 6];
    // Create a new ball at a random position and with the determined color and add it to the balls array
    balls.push(new Ball(
      random(ballDiameter * 2, tableWidth - ballDiameter * 2) + 50,
      random(ballDiameter * 2, tableHeight - ballDiameter * 2) + 50,
      color
    ));
  }
  return balls; // Return the balls array
}