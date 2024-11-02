/* This file is cue.js & it manages all rendering & functionalities related to cue ball*/

// A function named drawCueStick
function drawCueStick() 
{
  // If the cueBall exist, a mode is selected, & the cueBall is placed. Then..
  if (cueBall && modeSelected && cueBallPlaced) 
  {
    // Create a vector for the mouse position
    let mousePos = createVector(mouseX, mouseY);
    // Create a vector for the cueBall's position
    let cueBallPos = createVector(cueBall.body.position.x, cueBall.body.position.y);
    // Calculate the direction of the cue stick by subtracting the mouse position from the cueBall's position
    let cueDirection = p5.Vector.sub(cueBallPos, mousePos);

    // Calculate the distance between the cueBall & the mouse
    let distance = cueDirection.mag();

    // If the distance is less than or equal to the length of the cue stick
    if (distance <= cueStickLength) 
    {
      // Limit the magnitude of the cueDirection vector to the length of the cue stick
      cueDirection.limit(cueStickLength);

      stroke(255, 255, 0); // Set the stroke color to yellow
      strokeWeight(5); // Set the stroke weight to 5
      // Draw a line from the cueBall's position to the end of the cue stick (longer the stick, more the power & vice versa)
      line(cueBall.body.position.x, cueBall.body.position.y, cueBall.body.position.x - cueDirection.x, cueBall.body.position.y - cueDirection.y);

      // Draw the aimer
      drawAimer(cueBallPos, cueDirection);

      // Calculate the power of the cue stick based on the distance & round to nearest integer
      let cuePower = Math.round(map(distance, 0, cueStickLength, 0, 10));
    
      noStroke(); // Reset & disable stroke for others
      
      fill(0); // Set the fill color to black
      textSize(25); // Set the text size to 25
      textAlign(LEFT);
      // Display the power of the cue stick
      text(`Power: ${cuePower}`, cueBall.body.position.x - cueDirection.x / 2, cueBall.body.position.y - cueDirection.y / 2);
    }
  }
}

// A function named drawAimer that takes the cueBall's position & direction as parameters (Minor part of Extension Mode)
function drawAimer(cueBallPos, cueDirection) 
{
  // Define the length of the aim line
  let aimLineLength = 300;
  // Calculate the direction of the aim line by normalizing the cueDirection vector & multiplying it by the aimLineLength
  let aimDirection = cueDirection.copy().normalize().mult(aimLineLength);
  // Calculate the end point of the aim line by adding the aimDirection vector to the cueBall's position
  let endPoint = p5.Vector.add(cueBallPos, aimDirection);

  stroke(0, 255, 0); // Set the stroke color to green
  strokeWeight(2); // Set the stroke weight to 2

  // Draw a line from the cueBall's position to the end point of the aim line
  line(cueBallPos.x, cueBallPos.y, endPoint.x, endPoint.y);

  noStroke(); // Reset or disbale stroke for other texts
}

function displayCueBallPlacementMessage() // If Cueball is not placed or is pocketed then display this message in top center of table
{
  stroke(0);
  strokeWeight(2);
  fill(255); // Set text colour to black
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Click on the D semi-circle to place the Cue Ball to start playing", width / 2, height / 4);

  noStroke(); // Reset or disbale stroke for others
}
  
// A function named mousePressed that is called when the mouse is pressed
function mousePressed() 
{
  // If a mode has not been selected
  if (!modeSelected) 
  {
    // Then, set isMousePressed to false (do nothing)
    isMousePressed = false;
    // & exit the function
    return;
  }

  // If the cueBall exist & a mode is selected, then..
  if (cueBall && modeSelected) 
  {
    // Create a vector for the mouse position
    let mousePos = createVector(mouseX, mouseY);
    // Create a vector for the cueBall's position
    let cueBallPos = createVector(cueBall.body.position.x, cueBall.body.position.y);
    // Calculate the direction from the mouse to the cueBall
    let cueDirection = p5.Vector.sub(mousePos, cueBallPos);
    // If the magnitude of the cueDirection vector is less than the length of the cue stick
    if (cueDirection.mag() < cueStickLength) 
    {
      // Set isMousePressed to true
      isMousePressed = true;
      // Calculate cueStickPower and round to the nearest integer
      cueStickPower = Math.round(map(cueDirection.mag(), 0, 100, 0, 10));
    }
  }

  // If a mode is selected, the cueBall is not placed & the mouse click is within the table
  if (modeSelected && !cueBallPlaced && isClickWithinD(mouseX, mouseY)) 
  {
    // Create a new cueBall at the mouse position
    cueBall = new Ball(mouseX, mouseY, 'cue');
    // Set cueBallPlaced to true
    cueBallPlaced = true;
    console.log(`Cue ball placed at (${mouseX}, ${mouseY})`);
  }
}

// A function named mouseReleased that is called when the mouse is released
function mouseReleased() 
{
  // If a mode has not been selected
  if (!modeSelected) 
  {
    // Then, set isMouseReleased to false (do nothing)
    isMouseReleased  = false;
    // & exit the function
    return;
  }

  // If the mouse was pressed, the cueBall exist & a mode is selected
  if (isMousePressed && cueBall && modeSelected) 
  {
    // mousepress is only enabled If the speed of the cueBall's body is less than 0.1
    if (cueBall.body.speed < 0.1) 
    {
      // Call the hitCueBall function to hit the cue ball
      hitCueBall();
    }
    // Reset the power of the cue stick to 0
    cueStickPower = 0;
    // Set isMousePressed to false
    isMousePressed = false;
  }
}

// A function named isClickWithinD that takes x & y coordinates as parameters
function isClickWithinD(x, y) 
{
  // Calculate the distance from the point (x, y) to the center of the D zone
  let distToCenter = dist(x, y, dZoneCenterX, dZoneCenterY);
  // Return true if the distance to the center is less than the radius of the D zone & the x coordinate is less than or equal to the x coordinate of the D zone's center
  return distToCenter < dZoneRadius && x <= dZoneCenterX;
}

// A function named hitCueBall
function hitCueBall() 
{
  // Create a vector for the mouse position
  let mousePos = createVector(mouseX, mouseY);
  // Create a vector for the cueBall's position
  let cueBallPos = createVector(cueBall.body.position.x, cueBall.body.position.y);
  // Calculate the direction from the mouse to the cueBall
  let cueDirection = p5.Vector.sub(cueBallPos, mousePos);
  // Normalize the cueDirection vector to get a unit vector
  cueDirection.normalize();

  // Use cueStickPower directly as the force
  let forceMagnitude = cueStickPower * 0.4; // Use cueStickPower directly
  
  // Set the cueBall's body to be dynamic (not static)
  Body.setStatic(cueBall.body, false);
  // Apply a force to the cueBall's body in the direction of the cue stick
  Body.applyForce(cueBall.body, cueBall.body.position, 
  {
    x: cueDirection.x * forceMagnitude * 0.005, // Scale down by 0.005
    y: cueDirection.y * forceMagnitude * 0.005  // Scale down by 0.005
  });
}