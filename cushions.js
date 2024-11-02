/* This file is cushions.js which draws the cushions and set it's options (properties) */

// A function named createCushionConstraints
function createCushionConstraints() 
{
    // Options defined for cushions (are immovable & very bouncy)
    const cushionOptions = { isStatic: true, restitution: 0.5, friction: 0.1 }; 
  
    // Define vertices for all 6 cushions
    let topLeftCushionVertices = [
      { x: -600 / 2.2 + 25, y: 17 },
      { x: 550 / 5 - 25, y: 17 },
      { x: 550 / 5 - 2.5, y: 0 },
      { x: -600 / 2 + 22, y: 0 }
    ];
    
    let topRightCushionVertices = [
      { x: -600 / 2.2 + 25, y: 17 },
      { x: 550 / 5 - 25, y: 17 },
      { x: 550 / 5 - 2.5, y: 0 },
      { x: -600 / 2 + 22, y: 0 }
    ];
    
    let bottomRightCushionVertices = [
      { x: -600 / 2.2 + 25, y: -17 },
      { x: 550 / 5 - 25, y: -17 },
      { x: 550 / 5 - 2.5, y: 0 },
      { x: -600 / 2 + 22, y: 0 }
    ];
    
    let bottomLeftCushionVertices = [
      { x: -600 / 2.2 + 25, y: 0 },
      { x: 550 / 5 - 25, y: 0 },
      { x: 550 / 5 - 2.5, y: 17 },
      { x: -600 / 2 + 22, y: 17 }
    ];
  
    let leftVerticalCushionVertices = [
      { x: 0, y: -600 / 2.2 + 25 },
      { x: 0, y: 500 / 5 - 25 },
      { x: -17, y: 500 / 5 - 2.5 },
      { x: -17, y: -600 / 2 + 22 }
    ];
  
    let rightVerticalCushionVertices = [
      { x: 0, y: -600 / 2.2 + 25 },
      { x: 0, y: 500 / 5 - 25 },
      { x: 17, y: 500 / 5 - 2.5 },
      { x: 17, y: -600 / 2 + 22 }
    ];
  
    // Create the cushions using the Bodies.fromVertices method & the defined vertices
    let topLeftCushion = Bodies.fromVertices(tableWidth / 2 - 165, height - 480, topLeftCushionVertices, cushionOptions);
    let topRightCushion = Bodies.fromVertices(tableWidth / 2 + 265, height - 480, topRightCushionVertices, cushionOptions);
    let bottomRightCushion = Bodies.fromVertices(tableWidth / 2 + 265, tableHeight + 30, bottomRightCushionVertices, cushionOptions);
    let bottomLeftCushion = Bodies.fromVertices(tableWidth / 2 - 165, tableHeight + 30, bottomLeftCushionVertices, cushionOptions);
    let leftVerticalCushion = Bodies.fromVertices(width / 2 - 430, height - 270, leftVerticalCushionVertices, cushionOptions);
    let rightVerticalCushion = Bodies.fromVertices(width / 2 + 430, height - 270, rightVerticalCushionVertices, cushionOptions);
  
    // Add the cushions to the Matter.js world
    World.add(engine.world, [topLeftCushion, topRightCushion, bottomRightCushion, bottomLeftCushion, leftVerticalCushion, rightVerticalCushion]);
    
    // Push the cushions to the cushionBodies array
    cushionBodies.push(topLeftCushion, topRightCushion, bottomRightCushion, bottomLeftCushion, leftVerticalCushion, rightVerticalCushion);  
  }

// A function named drawCushions
function drawCushions() 
{
  // Loop over each body in the cushionBodies array
  for (let i = 0; i < cushionBodies.length; i++) 
  {  
    noStroke(); // Disable the stroke for cushions
  
    // Get the current time in milliseconds
    let currentTime = millis();
    // If the cushion has been hit recently (within cushionColorChangeTime milliseconds)
    if (cushionHitTimes.has(cushionBodies[i]) && currentTime - cushionHitTimes.get(cushionBodies[i]) < cushionColorChangeTime) 
    {
      // Set the fill color to the cushion hit color
      fill(cushionHitColor);
    } 
    else 
    {
      // Set the fill color to the original cushion color
      fill(cushionOriginalColor);
    }
  
    // Save the current transformation matrix
    push();
    // Translate the origin to the cushion's position
    translate(cushionBodies[i].position.x, cushionBodies[i].position.y);
    // Rotate the coordinate system by the cushion's angle
    rotate(cushionBodies[i].angle);
    // Begin a new shape
    beginShape();
    // For each vertex in the cushion's vertices
    cushionBodies[i].vertices.forEach(v => {
      // Add a vertex to the shape at the relative position of the vertex
      vertex(v.x - cushionBodies[i].position.x, v.y - cushionBodies[i].position.y);
    });
    // Close the shape
    endShape(CLOSE);
    // Restore the transformation matrix
    pop();
  }
}