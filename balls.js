/* This file is ball.js, where all the properties of balls are set & balls are drawn */

// A class named Ball
class Ball 
{
  // Constructor for the Ball class, takes x & y coordinates & a type as parameters
  constructor(x, y, type) 
  {
    // Assign the type to the instance of the Ball
    this.type = type;
    // Create a circular body for the Ball using the Matter.js Bodies.circle method
    this.body = Bodies.circle(x, y, ballDiameter / 2, 
    {
      restitution: 0.9, // The body's restitution, which is its bounciness
      friction: 0.005, // The body's friction, which is the resistance it experiences when moving over another body
    });
    // Add the body to the Matter.js world
    World.add(world, this.body);
  }

  // Method to draw the Ball on the canvas
  draw() 
  {
    // Set the fill color to the color returned by the getColor method
    fill(this.getColor());
    stroke(0); // Black outline
    strokeWeight(1);
    // Draw an ellipse at the body's position with the diameter of the ball
    ellipse(this.body.position.x, this.body.position.y, ballDiameter, ballDiameter);

    // If the ball is not the cue ball
    if (this.type !== 'cue') 
    {
      noStroke(); // Disable stroke for smaller ellipse 
      // Set the fill color to white for the light reflection
      fill(255, 255, 255, 100);
      // Draw a smaller ellipse at the top of the ball to simulate the light reflection
      ellipse(this.body.position.x - ballDiameter / 10 + 5, this.body.position.y - ballDiameter / 5, ballDiameter / 3, ballDiameter / 3);
    }
    noStroke(); // Reset stroke for others
  }

  // Method to get the color of the Ball based on its type
  getColor() 
  {
    // Switch statement to handle different types of balls
    switch (this.type) 
    {
      case 'cue':
        return [255, 255, 255]; // White color for the cue ball
      case 'red':
        return [255, 0, 0]; // Red color for the red ball
      case 'green':
        return [0, 255, 0]; // Green color for the green ball
      case 'brown':
        return [139, 69, 19]; // Brown color for the brown ball
      case 'yellow':
        return [255, 255, 0]; // Yellow color for the yellow ball
      case 'blue':
        return [0, 0, 255]; // Blue color for the blue ball
      case 'pink':
        return [255, 0, 255]; // Pink color for the pink ball
      case 'black':
        return [0, 0, 0]; // Black color for the black ball
      default:
        return [255, 255, 255]; // Default to white if no type matches
    }
  }

  // Method to reset the position & velocity of the Ball
  resetPosition(x, y) 
  {
    // Set the position of the body to the given x & y coordinates
    Body.setPosition(this.body, { x, y });
    // Set the velocity of the body to 0
    Body.setVelocity(this.body, { x: 0, y: 0 });
    // Set the angular velocity of the body to 0
    Body.setAngularVelocity(this.body, 0);
  }
}

// A function to draw balls
function drawBalls() 
{
  // For each ball in the redBalls array, call its draw method
  redBalls.forEach(ball => ball.draw());
  // For each ball in the colorBalls array, call its draw method
  colorBalls.forEach(ball => ball.draw());

  // If the cueBall is placed & exists (is not null)
  if (cueBallPlaced && cueBall) 
  {
    // Then, draw the cueBall
    cueBall.draw();
  }
  // Call the drawCueStick function to draw the cue stick
  drawCueStick();
}