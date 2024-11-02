/* This file is collision.js where all the collisions are managed */

// A function named detectCueBallCollision that takes an event as a parameter
function detectCueBallCollision(event) 
{
    // Get the pairs from the event
    let pairs = event.pairs;
  
    // For each pair in the pairs array
    pairs.forEach(pair => {
      // Destructure bodyA & bodyB from the pair
      let { bodyA, bodyB } = pair;
  
      // If the cueBall exists & either bodyA or bodyB is the cueBall's body
      if (cueBall && (bodyA === cueBall.body || bodyB === cueBall.body)) 
      {
        // The other body is the one that is not the cueBall's body
        let otherBody = bodyA === cueBall.body ? bodyB : bodyA;
  
        // If the other body is in the redBalls array
        if (redBalls.some(ball => ball.body === otherBody)) 
        {
          // Then, set the collision message to indicate a collision with a red ball
          collisionMessage = "Cue ball Last Activity - Red ball collision";
          // If the hitSound is defined, play the sound
          if (hitSound) hitSound.play();
        }
  
        // If the other body is in the colorBalls array
        if (colorBalls.some(ball => ball.body === otherBody)) 
        {
          // Then, set the collision message to indicate a collision with a color ball
          collisionMessage = "Cue ball Last Activity - Color ball collision";
          // If the hitSound is defined, play the sound
          if (hitSound) hitSound.play();
        }
  
        // If the other body is in the cushionBodies array
        if (cushionBodies.includes(otherBody)) 
        {
          // Then, set the collision message to indicate a collision with a cushion
          collisionMessage = "Cue ball Last Activity - Cushion collision";
        }
      }
    });
}

function displayCollisionMessage() // Display the collision Message below the table & in center 
{
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text(collisionMessage, width / 2, height - 10);
}

// A function named handleCollision that takes an event as a parameter
function handleCollision(event) 
{
  // Get the pairs from the event
  let pairs = event.pairs;

  // For each pair in the pairs array
  pairs.forEach(pair => {
    // Destructure bodyA & bodyB from the pair
    let { bodyA, bodyB } = pair;

    // If either bodyA or bodyB is in the cushionBodies array
    if (cushionBodies.includes(bodyA) || cushionBodies.includes(bodyB)) 
    {
      // The cushion is the body that is in the cushionBodies array
      let cushion = cushionBodies.includes(bodyA) ? bodyA : bodyB;
      // Set the hit time of the cushion to the current time in milliseconds
      cushionHitTimes.set(cushion, millis());
      // If the tableSound is defined, play the sound
      if (tableSound) tableSound.play();
    }

    // Filter the redBalls array to remove any balls that are in a pocket
    redBalls = redBalls.filter(ball => {
      // If the ball is in a pocket
      if (isBallInPocket(ball.body)) 
      {
        // Then, remove the ball from the Matter.js world
        Matter.World.remove(world, ball.body);
        console.log("Red ball potted and removed from the world");
        // & exclude the ball from the new redBalls array
        return false;
      }
      // Include the ball in the new redBalls array
      return true;
    });

    // Filter the colorBalls array to handle any balls that are in a pocket
    colorBalls = colorBalls.filter(ball => {
      // If the ball is in a pocket
      if (isBallInPocket(ball.body)) 
      {
        console.log(`${ball.type} ball potted`);
        // Then define a variable for the designated spot where the ball will be placed
        let designatedSpot;
        // & switch statement to handle different types of balls
        switch (colorBalls.indexOf(ball)) 
        {
          case 0: // Green ball
            designatedSpot = { x: tableWidth / 3 + 50, y: height / 2 - tableHeight / 4 };
            break;
          case 1: // Brown ball
            designatedSpot = { x: tableWidth / 3 + 50, y: height / 2 };
            break;
          case 2: // Yellow ball
            designatedSpot = { x: tableWidth / 3 + 50, y: height / 2 + tableHeight / 4 };
            break;
          case 3: // Blue ball
            designatedSpot = { x: width / 2, y: height / 2 };
            break;
          case 4: // Pink ball
            designatedSpot = { x: width / 2 + ballDiameter * 6, y: height / 2 };
            break;
          case 5: // Black ball
            designatedSpot = { x: width / 2 + 350, y: height / 2 };
            break;
        }
        // Reset the position of the ball to the designated spot
        ball.resetPosition(designatedSpot.x, designatedSpot.y);

        // If the last colored ball was pocketed & the current ball is pocketed
        if (lastColoredBall !== null && Math.abs(colorBalls.indexOf(ball) - colorBalls.indexOf(lastColoredBall)) >= 0) 
        {
          // Then, alert the user that two consecutive colored balls were pocketed
          alert("Error: Two consecutive colored balls were pocketed!");
        }
        // Set the last colored ball to the current ball
        lastColoredBall = ball;
        // Include the ball in the new colorBalls array
        return true;
      }
      // Include the ball in the new colorBalls array
      return true;
    });

    // If the cueBall exist & is in a pocket
    if (cueBall && isBallInPocket(cueBall.body)) 
    {
      // Then, remove the cueBall from the Matter.js world
      Matter.World.remove(world, cueBall.body);
      // & set the cueBall to null
      cueBall = null;
      // & set cueBallPlaced to false
      cueBallPlaced = false;

      console.log(`Cue ball potted`);

      // If the mode is 4
      if (mode === 4) 
      {
        // Then decrease the score by 10
        score -= 10;
      }
    }
  });
}