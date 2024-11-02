/* This is ExtensionMode.js, which display instructions & apply random attract/repel behavior to pockets (For mode 4)*/

function displayExtensionModeInstructions() 
{
  push();
  // Transparent Black rect background for Instructions in center of canvas
  fill(0, 0, 0, 170);
  rectMode(CENTER);
  rect(width / 2, height / 2, 835, 100, 20);

  // Instructions text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("Extension Mode: This mode has Gravity Pockets, which sometimes attract a ball towards it & sometimes repel a ball away from it.\nIf it attracts a cue ball, you lose 10 points. The game starts with a score of 50, which is also the maximum score. \nIf your score drops & you want to return to the maximum score, you may press R to restart.\nPress ENTER to start.", width / 2, height / 2);
  pop();
}

function displayScore() // Display score on top left corner of canvas
{
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text(`Score: ${score}`, width / 2 - 450, height / 2 - 250);
}

function randomBehavior() // A function named randomBehavior
{
  // Return 'attract' if a random number is greater than 0.5, otherwise return 'repel'
  return Math.random() > 0.5 ? 'attract' : 'repel';
}

function applyPocketForces() // A function named applyPocketForces
{
  // Define the range of influence of the pockets
  const influenceRange = pocketSize * 2;
  // Define the maximum force magnitude
  const maxForceMagnitude = 0.01;
  // Create an array of all balls, including the cue ball if it exists
  let allBalls = cueBall ? redBalls.concat(colorBalls).concat([cueBall]) : redBalls.concat(colorBalls);

  // For each ball in the allBalls array
  allBalls.forEach(ball => {
    // If the ball exists
    if (ball) 
    {
      // For each pocket in the gravityPockets array
      gravityPockets.forEach((pocket, index) => {
        // Calculate the distance from the ball to the pocket
        const distance = dist(ball.body.position.x, ball.body.position.y, pocket.x, pocket.y);
        // If the distance is less than the influence range
        if (distance < influenceRange) 
        {
          // Map the distance to a force magnitude between 0 & the maximum force magnitude
          const forceMagnitude = map(distance, 0, influenceRange, maxForceMagnitude, 0);
          // Calculate the direction of the force by creating a vector from the ball to the pocket & normalizing it
          const forceDirection = createVector(pocket.x - ball.body.position.x, pocket.y - ball.body.position.y).normalize();
          // If the behavior of the pocket is 'attract'
          if (pocketBehaviors[index] === 'attract') 
          {
            // Apply a force to the ball in the direction of the pocket with the calculated magnitude
            Body.applyForce(ball.body, ball.body.position, forceDirection.mult(forceMagnitude));
            console.log(`Ball got attracted`);
          } 
          else 
          {
            // Otherwise, apply a force to the ball in the opposite direction of the pocket with the calculated magnitude
            Body.applyForce(ball.body, ball.body.position, forceDirection.mult(-forceMagnitude));
            console.log(`Ball got repelled`);
          }
          // Set the behavior of the pocket to a random behavior
          pocketBehaviors[index] = randomBehavior();
        }
      });
    }
  });
}