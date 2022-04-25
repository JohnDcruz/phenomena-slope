class Entity {
  constructor(src, x, y, width, height) {
    this.image = new Image(width, height);
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  intersects(other) {
    let tw = this.width;
    let th = this.height;
    let rw = other.width;
    let rh = other.height;
    if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
      return false;
    }
    let tx = this.x;
    let ty = this.y;
    let rx = other.x;
    let ry = other.y;
    rw += rx;
    rh += ry;
    tw += tx;
    th += ty;
    return (
        (rw < rx || rw > tx) &&
        (rh < ry || rh > ty) &&
        (tw < tx || tw > rx) &&
        (th < ty || th > ry)
    );
  }

}

class Invader extends Entity {
  constructor(x, y) {
    super("img/invader.png", x, y, 50, 50, 0, 0);
  }
}

class Tank extends Entity {
  constructor(x, y) {
    super("img/tank.png", x, y, 50, 50, 0, 0);
  }
}

class Missile extends Entity {
  constructor(x, y) {
    super("img/missile.png", x, y, 10, 30);
  }
}

class Game {
  constructor() {

    this.tank = new Tank(this.getXCoordinate(), this.getYCoordinate());

    this.invadersHit = 0;
    this.createInvader();
    this.coordinates = {};
  }

  createInvader() {
    let x = this.getXCoordinate();
    let y = this.getYCoordinate();

    while (x === this.tank.x) {
      x = this.getXCoordinate();
    }

    this.invader = new Invader(x, y);
  }

  writeText(ctx) {
    //outputs all text
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";

    ctx.fillText("0", 2, 597);
    ctx.fillText("1", 35, 597);
    ctx.fillText("2", 75, 597);
    ctx.fillText("3", 115, 597);
    ctx.fillText("4", 155, 597);
    ctx.fillText("5", 195, 597);
    ctx.fillText("6", 235, 597);
    ctx.fillText("7", 275, 597);
    ctx.fillText("8", 315, 597);
    ctx.fillText("9", 355, 597);
    ctx.fillText("10", 390, 597);
    ctx.fillText("11", 430, 597);
    ctx.fillText("12", 460, 597);

    ctx.fillText("1", 2, 565);
    ctx.fillText("2", 2, 525);
    ctx.fillText("3", 2, 485);
    ctx.fillText("4", 2, 445);
    ctx.fillText("5", 2, 405);
    ctx.fillText("6", 2, 365);
    ctx.fillText("7", 2, 325);
    ctx.fillText("8", 2, 285);
    ctx.fillText("9", 2, 245);
    ctx.fillText("10", 2, 205);
    ctx.fillText("11", 2, 165);
    ctx.fillText("12", 2, 125);
    ctx.fillText("13", 2, 85);
    ctx.fillText("14", 2, 45);

  }

  random(lowerBound, upperBound) {
    //returns random number between bounds
    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
  }

  getXCoordinate() {
    return 15 + (40 * this.random(0, 10));
  }

  getYCoordinate() {
    return 15 + (40 * this.random(0, 13));
  }

  drawLine(canvas, ctx, slope, intercept) {

    let x2 = 0;
    let y2 = canvas.height - (intercept * 40);

    let inc = 0;

    this.coordinates[x2] = y2;

    while (inc < 1000) { //TODO: extend line properly
      if (slope !== 0) {
        x2 += Math.abs(1/slope);
      }

      if (slope > 0) {
        y2 -= 1;
      } else if (slope === 0) {
        x2 += 1;
      } else {
        y2 += 1;
      }
      inc += 1;

      this.coordinates[Math.round(x2)] = Math.round(y2);
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - (intercept * 40));
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  }

  checkCollision() {

    let collidesTank = false;
    let collidesInvader = false;

    for (const [x, y] of Object.entries(this.coordinates)) {

      let missile = new Missile(x, y);

      if (missile.intersects(this.tank)) {
        collidesTank = true;
      }

      if (missile.intersects(this.invader)) {
        collidesInvader = true;
      }
    }

    return collidesTank && collidesInvader;
  }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let game = new Game(canvas);
let slope = 1;
let intercept = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();

  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }

  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  ctx.strokeStyle = "black";
  ctx.stroke();

  game.drawLine(canvas, ctx, slope, intercept);

  game.tank.draw(ctx, canvas.height);
  game.invader.draw(ctx);

  game.writeText(ctx);
  window.requestAnimationFrame(draw);
}

draw();

const headerCanvas = document.getElementById("headerCanvas")
const headerCtx = headerCanvas.getContext("2d");
function drawHeader() {
  headerCtx.clearRect(0, 0, 480, 100);
  headerCtx.font = "16px Arial";
  headerCtx.fillStyle = "#ffffff";
  headerCtx.fillText("The properties of a line, slope and y-intercept, are related in the", 10, 25);
  headerCtx.fillText("formula y=mx+b, where m is the slope and b is the y-intercept.", 10, 45);
  headerCtx.fillText("Find the formula for a line that intersects both the spaceship and", 10, 65);
  headerCtx.fillText("UFO so that the spaceship can accurately fire a missile!", 10, 85);
  window.requestAnimationFrame(drawHeader);
}
drawHeader();

const interfaceCanvas = document.getElementById("interfaceCanvas")
const interfaceCtx = interfaceCanvas.getContext("2d");

let mAddSmall = new Image(20, 20);
mAddSmall.src = "img/plus-solid.svg"
let bAddSmall = new Image(20, 20);
bAddSmall.src = "img/plus-solid.svg"
let mMinusSmall = new Image(20, 20);
mMinusSmall.src = "img/minus-solid.svg"
let bMinusSmall = new Image(20, 20);
bMinusSmall.src = "img/minus-solid.svg"

let mAddBig = new Image(20, 20);
mAddBig.src = "img/plus-solid.svg"
let bAddBig = new Image(20, 20);
bAddBig.src = "img/plus-solid.svg"
let mMinusBig = new Image(20, 20);
mMinusBig.src = "img/minus-solid.svg"
let bMinusBig = new Image(20, 20);
bMinusBig.src = "img/minus-solid.svg"

let fire = new Image(50, 50);
fire.src = "img/rocket-solid.svg"

function drawInterface() {
  interfaceCtx.clearRect(0, 0, 480, 100);
  interfaceCtx.font = "16px Arial";
  interfaceCtx.fillStyle = "#ffffff";
  interfaceCtx.fillText("y = " + slope.toFixed(1) + " + " + intercept.toFixed(1), 40, 35);
  interfaceCtx.fillText("score: " + game.invadersHit, 55, 75);
  interfaceCtx.fillText("m", 240, 52);
  interfaceCtx.fillText("b", 242, 82);
  interfaceCtx.fillText(".1", 270, 27);
  interfaceCtx.fillText("1", 300, 27);
  interfaceCtx.fillText(".1", 210, 27);
  interfaceCtx.fillText("1", 180, 27);
  interfaceCtx.drawImage(mAddSmall, 270, 40, 15, 15);
  interfaceCtx.drawImage(bAddSmall, 270, 70, 15, 15);
  interfaceCtx.drawImage(mMinusSmall, 210, 40, 15, 15);
  interfaceCtx.drawImage(bMinusSmall, 210, 70, 15, 15);
  interfaceCtx.drawImage(mAddBig, 300, 40, 15, 15);
  interfaceCtx.drawImage(bAddBig, 300, 70, 15, 15);
  interfaceCtx.drawImage(mMinusBig, 180, 40, 15, 15);
  interfaceCtx.drawImage(bMinusBig, 180, 70, 15, 15);
  interfaceCtx.drawImage(fire, 375, 25, 50, 50);

  window.requestAnimationFrame(drawInterface);
}

interfaceCanvas.addEventListener("mousedown", clicked, false);

function clicked(e){
  let x = e.layerX;
  let y = e.layerY;

  if(x>370 && x<430 && y>10 && y<80){
    if (game.checkCollision()) {
      game.invadersHit += 1;
    }
  }

  if(x>260 && x<290 && y>40 && y<60){
    slope += 0.1;
  }

  if(x>200 && x<230 && y>40 && y<60){
    slope -= 0.1;
  }

  if(x>260 && x<290 && y>70 && y<90){
    intercept += 0.1;
  }

  if(x>200 && x<230 && y>70 && y<90){
    intercept -= 0.1;
  }

  if(x>295 && x<315 && y>40 && y<60){
    slope += 1.0;
  }

  if(x>175 && x<195 && y>40 && y<60){
    slope -= 1.0;
  }

  if(x>295 && x<315 && y>70 && y<90){
    intercept += 1.0;
  }

  if(x>175 && x<195 && y>70 && y<90){
    intercept -= 1.0;
  }
}


drawInterface();
