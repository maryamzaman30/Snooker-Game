/* This file is table.js, it draws the table & all the things related to a table. It also creates a constraints for table border */

function createTableBorderConstraints() // A function named createTableBorderConstraints
{
  const wallOptions = { isStatic: true, restitution: 0.9 }; // Define the options for the walls

  // Create boundary walls (left, right, top, bottom) using rectangle around the table with specified dimensions & options
  let leftWall = Bodies.rectangle(50, height / 2, ballDiameter, height, wallOptions);
  let rightWall = Bodies.rectangle(width - 50, height / 2, ballDiameter, height, wallOptions);
  let topWall = Bodies.rectangle(width / 2, 50, width, ballDiameter, wallOptions);
  let bottomWall = Bodies.rectangle(width / 2, height - 50, width, ballDiameter, wallOptions);

  // Add the walls to the Matter.js world
  World.add(world, [leftWall, rightWall, topWall, bottomWall]);
}

function drawTable() // A function named drawTable
{ 
  rectMode(CENTER);
  
  // Define the colors for gradient, c1 & c2, c short for color
  let c1 = color(0, 102, 0);
  let c2 = color(0, 153, 0);

  // Adjust the x, y, width, & height to be within the border
  let borderWidth = 5;  // Value to match border width
  let gradientX = width / 2 - tableWidth / 2 + borderWidth;
  let gradientY = height / 2 - tableHeight / 2 + borderWidth;
  let gradientWidth = tableWidth - 2 * borderWidth;
  let gradientHeight = tableHeight - 2 * borderWidth;

  // Apply the gradient to the baize
  // Draw a rectangle at the center of the canvas with the dimensions of the table
  setGradient(gradientX, gradientY, gradientWidth, gradientHeight, c1, c2, 'Y_AXIS');  
  
  strokeWeight(1); // Set the stroke weight to 1 for D zone
  stroke(255); // Stroke color to white
  noFill();
  // Draw an arc at the specified position with the specified dimensions and angles
  arc(tableWidth / 3 + 50, tableHeight / 2 + 50, tableWidth / 4, tableHeight / 2, HALF_PI, -HALF_PI);
  // Draw a line at the specified coordinates
  line(tableWidth / 3 + 50, tableHeight - tableWidth + 50, tableWidth / 3 + 50, tableHeight * 5 + 50);

  drawCushions(); // Call the drawCushions function to draw the cushions

  stroke(51, 25, 0); // Stroke color to a dark brown for table border
  strokeWeight(25);
  noFill();
  // Draw a rectangle with rounded corners at the center of the canvas with the dimensions of the table
  rect(width / 2, height / 2, tableWidth, tableHeight, 10);
  
  noStroke(); // Disable or reset the stroke for others

  // Pockets, Top-left
  drawPocket(cornerRadius + 40, cornerRadius + 40, cornerRadius + 27, cornerRadius + 30, 40, 45, cornerRadius, 0, cornerRadius, 0);
  // Top-right
  drawPocket(tableWidth - cornerRadius + 60, cornerRadius + 40, tableWidth - cornerRadius + 73, cornerRadius + 30, 40, 45, 0, cornerRadius, 0, cornerRadius);
  // Bottom-left
  drawPocket(cornerRadius + 40, tableHeight - cornerRadius + 62, cornerRadius + 27, tableHeight - cornerRadius + 70, 40, 45, 0, cornerRadius, 0, cornerRadius);
  // Bottom-right
  drawPocket(tableWidth - cornerRadius + 60, tableHeight - cornerRadius + 62, tableWidth - cornerRadius + 73, tableHeight - cornerRadius + 70, 40, 45, cornerRadius, 0, cornerRadius, 0);

  // Top-middle
  drawPocket(tableWidth / 2 + 50, cornerRadius + 37, tableWidth / 2 + 50, cornerRadius + 19.5, 40, 24);
  // Bottom-middle
  drawPocket(tableWidth / 2 + 50, tableHeight - cornerRadius + 65, tableWidth / 2 + 50, tableHeight - cornerRadius + 81, 40, 24);
}

/* I wrote this code with help from:
   1. https://github.com/mattluutrang/mattluutrang.github.io/blob/36a54531b8d84a59edd6476e9975959c9c03e94a/games_src/Video-Game-Final-Project/utils.js
   2. https://github.com/dqna64/alto-parallax/blob/d180b4b52bfde28be58083aeef94e7d6e2bd2c8c/sketch.js  */
// The setGradient function creates a linear gradient between two colors (c1 and c2) 
// within a rectangle defined by its top-left corner (x, y), width (w), and height (h).
function setGradient(x, y, w, h, c1, c2, axis) 
{
  noFill(); // noFill disables filling geometry. It will only draw the stroke.

  // If the gradient's direction is from top to bottom
  if (axis === 'Y_AXIS') 
  {
    // Loop from the top edge of the rectangle to the bottom edge
    for (let i = y; i <= y + h; i++) 
    {
      // Map the current y-coordinate (i) to a value between 0 and 1 (inter)
      let inter = map(i, y, y + h, 0, 1);
      // Interpolate between the two colors based on the value of inter
      let c = lerpColor(c1, c2, inter);
      // Set the stroke color to the interpolated color
      stroke(c);
      // Draw a horizontal line at the current y-coordinate with the interpolated color
      line(x, i, x + w, i);
    }
  }  
  // If the gradient's direction is from left to right
  else if (axis === 'X_AXIS') 
  {
    // Loop from the left edge of the rectangle to the right edge
    for (let i = x; i <= x + w; i++) 
    {
      // Map the current x-coordinate (i) to a value between 0 and 1 (inter)
      let inter = map(i, x, x + w, 0, 1);
      // Interpolate between the two colors based on the value of inter
      let c = lerpColor(c1, c2, inter);
      // Set the stroke color to the interpolated color
      stroke(c);
      // Draw a vertical line at the current x-coordinate with the interpolated color
      line(i, y, i, y + h);
    }
  }
}