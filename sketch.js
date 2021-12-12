let unit = 2; // unit size in pixels. Also, one block equals one unit.
let noiseXY = 0.001; // also pseudo scale
let elevationGradient = 90.0; // gradient/slope designation/amount of elevationlines
let vertices = [];
let counter = 0;
let shortest = 999.0;
let shortIndex;
let refX, refY; // reference coordinates for sliding noise cutoff.

let distM; // max dist between ref and any coordinate. Serves as a max noise reference

let distR;
let noiseR;

// colors must be sorted lowest to heighest
let color = [
  "#aee9ff",
  "#dfedc8",
  "#cfe4b4",
  "#fff7df",
  "#fcebbb",
  "#fbd68e",
  "#e9bf9c",
  "#fcb47e",
  "#bc8f40",
  "#FFFFFF",
];

function setup() {
  createCanvas(800, 800);
  background(0);
  strokeCap(SQUARE);
  strokeWeight(1.5);
  
  noiseSeed(1900);
  noiseDetail(5, 0.6); // lower cutoff = lower height value = more water
  noiseXY = 0.008; // also pseudo scale
  elevationGradient = 10.0; //

  refX = int(random(0, width));
  refY = int(random(0, height));

  if (refX < width / 2) {
    maxDx = width - refX;
  } else maxDx = refX;
  if (refY < width / 2) {
    maxDy = width - refY;
  } else maxDy = refY;

  distM = sqrt(sq(maxDx) + sq(maxDy));
  print("ref x,y: " + refX + "," + refY);
  print("distM: " + distM);

  elevationGradients(); // creates heightmap
  //elevationVertices();
  latlon();
  airSpace();
  noFill();
  strokeWeight(0.5);
  stroke("#000000FF");
  circle(refX, refY, 24);
}

function scanforGreen(){
  for (let col = 0; col < width; col += unit) {
    //noiseDetail(5, (0.2+((0.6/width)*col)));
    for (let row = 0; row < height; row += unit) {


    }}

}

function elevationGradients() {
  // stroke("#00FF00FF");
  //  circle(refX, refY, 48);
  for (let col = 0; col < width; col += unit) {
    //noiseDetail(5, (0.2+((0.6/width)*col)));
    for (let row = 0; row < height; row += unit) {
      // sliding noise cutoff, inversely proportional to distance from reference
      distR = dist(refX, refY, col, row);
      noiseR = 0.8 - (distR / distM) * 0.6;
      noiseDetail(5, noiseR);

      let noiseP = noise(col * noiseXY, row * noiseXY); //

      if (noiseP < 0.1) noiseP = 0.0;

      let fraction = round(noiseP * elevationGradient);
      let newHeight = (255.0 / elevationGradient) * fraction;

      clr = floor(noiseP * 10);
      if (clr > 9) {
        clr = 9;
      }

      stroke(color[clr]); //color
      // edge
      // if (noiseP > 0.3 && noiseP < 0.305) {
      //   stroke(0);
      // }

      // smooth
      // stroke(newHeight);//greyscale
      // point(col, row);
     
      // blockworld
      noStroke();
      fill(color[clr]); 
      square(col,row,unit);
    }
  }
}

function elevationVertices() {
  strokeWeight(0.8);
  stroke(0);

  counter = 0;
  for (let col = 0; col < width; col += 1) {
    for (let row = 0; row < height; row += 1) {
      // color N,S,E,W
      let c = get(col, row);
      let ce = get(col + 1, row);
      let cs = get(col, row + 1);
      let linecolor = (0, 0, 0, 255);
      if (
        (c.toString() != cs.toString() || c.toString() != ce.toString()) &&
        c.toString() != linecolor.toString()
      ) {
        point(col, row);

        //  vertices[counter].set(col, row);// only store points on edges

        counter++;
      }
    }
  }
}

function latlon() {
  strokeWeight(0.2);
  stroke(0);
  let latitudeD = 47; // in degrees
  let longitudeD = 122; //
  let degtoRad = (TWO_PI / 360.0) * latitudeD; // deg to radians
  let mapAspect = 1.0 / cos(degtoRad);

  let latSize = 200; //
  let lonSize = latSize * mapAspect; //
  let latSpacing = latSize / 30.0;
  let lonSpacing = lonSize / 30.0;

  fill(80);
  textSize(30);
  let offset = int(random(0, 100));

  // push();
  //translate(offset, offset);
  // lat lon lines
  for (let i = 0; i < 6; i++) {
    line(i * latSize, 0, i * latSize, height); // longitudinal lines
    line(0, i * lonSize, width, i * lonSize); // latitude lines

    for (let j = 0; j < width; j += latSpacing) {
           line(j, i * lonSize, j, i * lonSize - 5);
    }
    for (let j = 0; j < height; j += lonSpacing) {
      line(i * latSize, j, i * latSize - 5, j);
    }
    
      for (let j = 0; j < width; j += latSpacing * 10) {
          line(j, i * lonSize+10, j, i * lonSize - 10);
    }
    
        for (let j = 0; j < height; j += lonSpacing*10) {
      line(i * latSize-10, j, i * latSize + 10, j);
    }

    if (i % 2 == 0) {
      // degrees of latitude
      // Left + Right loop, up/down hook
      text(latitudeD + "°", i * latSize + 10, 0 + 24);
      text(latitudeD - 1 + "°", i * latSize + 10, 2 * lonSize + 24);

      // degrees of longitude
      // up/down loop, Left + Right hook
      push();
      translate(latSize * 2 + 24, i * lonSize + 90);
      rotate(PI / -2);
      text(longitudeD + 0 + "°", 0, 0);
      pop();

      push();
      translate(0 + 24, i * lonSize + 90);
      rotate(PI / -2);
      text(longitudeD + 1 + "°", 0, 0);
      pop();
    }
  }
  // pop();
  print("Map Aspect ratio at " + latitudeD + " degrees: " + mapAspect);
  print("latLon completed");
}

function airSpace() {
  noFill();
  strokeWeight(6);

  stroke("#00348650");

  let xPos = int(random(0, width));
  let yPos = int(random(0, width));
  circle(xPos, yPos, 100);
  circle(xPos, yPos, 200);
}
