/* This file is pockets.js, it draws the pocket & manages the pocket's functionality */

// Function to draw a pocket, the cover & the pocket outline
function drawPocket(x, y, rectX, rectY, rectWidth, rectHeight, cornerRadiusTL = 0, cornerRadiusTR = 0, cornerRadiusBR = 0, cornerRadiusBL = 0) 
{
  // Draw the yellow covers
  fill(255, 255, 0); 
  rect(rectX, rectY, rectWidth, rectHeight, cornerRadiusTL, cornerRadiusTR, cornerRadiusBR, cornerRadiusBL);

  // Light brown Outline for pockets
  fill(199, 118, 11);
  // Draw an ellipse at the given position with a diameter slightly larger than the pocket size
  ellipse(x, y, pocketSize * 1.1, pocketSize * 1.1);

  // Black pockets
  fill(0);
  // Draw an ellipse at the given position with the pocket size as the diameter
  ellipse(x, y, pocketSize);
}

function isBallInPocket(ball) // A function named isBallInPocket that takes a ball as a parameter
{
// Define the positions of the pockets
const pockets = [
  { x: cornerRadius + 40, y: cornerRadius + 40 },
  { x: tableWidth - cornerRadius + 60, y: cornerRadius + 40 },
  { x: cornerRadius + 40, y: tableHeight - cornerRadius + 62 },
  { x: tableWidth - cornerRadius + 60, y: tableHeight - cornerRadius + 62 },
  { x: tableWidth / 2 + 50, y: cornerRadius + 37 },
  { x: tableWidth / 2 + 50, y: tableHeight - cornerRadius + 65 }
];

// Return true if the ball is in any of the pockets
return pockets.some(pocket => dist(ball.position.x, ball.position.y, pocket.x, pocket.y) < pocketSize / 2);
}