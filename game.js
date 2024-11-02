/* This file is game.js which is responsible for allowing the user to start the game, choose any of the modes & restart it, as well */

function displayMessages() // Display messages on the middle of table if mode is 0
{
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Press 1 for Standard Snooker", width / 2, height / 2 - 60);
  text("Press 2 for Random Red Balls", width / 2, height / 2 - 20);
  text("Press 3 for All Random Balls", width / 2, height / 2 + 20);
  text("Press 4 for Extension Mode", width / 2, height / 2 + 60);
  text("Press R to Restart", width / 2, height / 2 + 100); 
}

// A function named keyPressed that is called when a key is pressed
function keyPressed() 
{
  if (!modeSelected) // If a mode has not been selected
  {
    if (key === '1') // If the '1' key is pressed
    {
      mode = 1; // Set the mode to 1
      modeSelected = true; // Indicate that a mode has been selected
      console.log("Mode 1 selected");
      resetBalls(); // Reset the balls
    } 
    else if (key === '2') // If the '2' key is pressed
    {
      mode = 2; // Set the mode to 2
      modeSelected = true; // Indicate that a mode has been selected
      console.log("Mode 2 selected");
      randomizeRedBalls(); // Randomize the positions of the red balls
    } 
    else if (key === '3') // If the '3' key is pressed
    {
      mode = 3; // Set the mode to 3
      modeSelected = true; // Indicate that a mode has been selected
      console.log("Mode 3 selected");
      randomizeAllBalls(); // Randomize the positions of all the balls
    } 
    else if (key === '4') // If the '4' key is pressed (Extension Mode)
    {
      mode = 4; // Set the mode to 4
      modeSelected = true; // Indicate that a mode has been selected
      showExtensionModeInstructions = true; // Show the instructions for the extension mode
      console.log("Extension Mode selected");
    }
  } 
  else // If a mode has been selected
  {
    if (key === 'R' || key === 'r') // If the 'R' or 'r' key is pressed
    {
      mode = 0; // Reset the mode
      modeSelected = false; // Indicate that a mode has not been selected
      resetGame(); // Reset the game
      console.log("Game reset");
    }

    // If the extension mode instructions are being shown & the 'Enter' key is pressed
    if (showExtensionModeInstructions && key === 'Enter') 
    {
      showExtensionModeInstructions = false; // Hide the extension mode instructions
      modeSelected = true; // Indicate that a mode has been selected
      resetBalls(); // Reset the balls
      applyPocketForces(); // Apply forces to the pockets
    }
  }
}

// A function named resetGame
function resetGame() 
{
  World.clear(world, false); // Clear the Matter.js world but keep the engine
  
  // Reset the redBalls & colorBalls array to an empty array
  redBalls = [];
  colorBalls = [];

  cueBall = null; // Set the cueBall to null

  lastColoredBall = null; // Reset lastColoredBall to null
 
  score = 50; // Reset the score to 50

  createTableBorderConstraints(); // Call the createTableBorderConstraints function to create the table border constraints
  createCushionConstraints(); // Call the createCushionConstraints function to create the cushion constraints

  displayCueBallPlacementMessage(); // Tell the user to place the ball in center of D zone.

  cueBallPlaced = false; // Set cueBallPlaced to false
}