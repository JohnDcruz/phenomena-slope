class Entity {
  constructor(src, x, y, width, height, dx, dy) {
    //defines all basic properties of game entity
    this.image = new Image(width, height);
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx; //displacement in the x direction
    this.dy = dy; //displacement in the y direction
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  intersects(other) {
    //checks if two game entities intersect
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

class Missile extends Entity {
  constructor(x, y, dx, dy) {
    super("img/missile.png", x, y, 10, 30, dx, -dy);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan(this.dx/-this.dy));
    ctx.translate(-this.x, -this.y);
    super.draw(ctx);
    ctx.restore();
  }
}

class Tank extends Entity {
  constructor(x, y) {
    super("img/tank.png", x, y, 50, 50, 0, 0);
    this.missileFired = false;
  }

  draw(ctx, canvasHeight) {
    super.draw(ctx);

    //animates missiles
    if (this.missileFired) {
      //ensures missile does not go over canvas bounds
      if (this.missile.y < 0 || this.missile.y > 600 || this.missile.x < 0 || this.missile.x > 480) {
        this.missileFired = false;
      }
      this.missile.draw(ctx);
      this.missile.move();
    }
  }

  checkMissileCollision(invader) {
    let collided = false;

    if (this.missileFired) {
      if (this.missile.intersects(invader)) {
        collided = true;
        this.missileFired = false;
      }
    }

    return collided;
  }
}

class Game {
  constructor() {

    this.tank = new Tank(this.getXCoordinate(), this.getYCoordinate());

    this.invadersHit = 0;
    this.createInvader();
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

    while (inc < 30) {
      x2 += Math.abs(1/slope) * 40;
      if (slope >= 0) {
        y2 -= 40;
      } else {
        y2 += 40;
      }
      inc += 1;
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

  playGame(canvas, ctx) {
    //animates invaders, deletes if they are hit or reach end of canvas
    if (this.tank.checkMissileCollision(this.invader)) {
      this.invadersHit += 1;
      this.createInvader();
    } else {
      this.invader.draw(ctx);
    }
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

  game.playGame(canvas, ctx);

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

let mAdd = new Image(20, 20);
mAdd.src = "img/plus-solid.svg"
let bAdd = new Image(20, 20);
bAdd.src = "img/plus-solid.svg"
let mMinus = new Image(20, 20);
mMinus.src = "img/minus-solid.svg"
let bMinus = new Image(20, 20);
bMinus.src = "img/minus-solid.svg"
let fire = new Image(50, 50);
fire.src = "img/rocket-solid.svg"

function drawInterface() {
  interfaceCtx.clearRect(0, 0, 480, 100);
  interfaceCtx.font = "16px Arial";
  interfaceCtx.fillStyle = "#ffffff";
  interfaceCtx.fillText("y = " + slope.toFixed(2) + " + " + intercept.toFixed(2), 10, 35);
  interfaceCtx.fillText("score:" + game.invadersHit, 10, 75);
  interfaceCtx.fillText("m", 240, 35);
  interfaceCtx.fillText("b", 240, 75);
  interfaceCtx.drawImage(mAdd, 270, 22, 15, 15);
  interfaceCtx.drawImage(bAdd, 270, 62, 15, 15);
  interfaceCtx.drawImage(mMinus, 210, 22, 15, 15);
  interfaceCtx.drawImage(bMinus, 210, 62, 15, 15);
  interfaceCtx.drawImage(fire, 400, 25, 50, 50);

  window.requestAnimationFrame(drawInterface);
}

interfaceCanvas.addEventListener("mousedown", clicked, false);

function clicked(e){
  let x = e.layerX;
  let y = e.layerY;

  if(x>390 && x<460 && y>10 && y<80){
    if (!game.tank.missileFired) {
      game.tank.missile = new Missile (game.tank.x + 20, game.tank.y + 10, 1/slope, 1);
      game.tank.missileFired = true;
    }
  }

  if(x>260 && x<290 && y>20 && y<40){
    slope += 0.1;
  }

  if(x>200 && x<230 && y>20 && y<40){
    slope -= 0.1;
  }

  if(x>260 && x<290 && y>60 && y<80){
    intercept += 0.1;
  }

  if(x>200 && x<230 && y>60 && y<80){
    intercept -= 0.1;
  }
}


drawInterface();
