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
  constructor(x, y, dx, dy) {
    super("img/missile.png", x, y, 10, 30);
    this.dx = dx;
    this.dy = -dy;
  }

  move() {
    this.x += Math.abs(this.dx);

    if (this.dx < 0) {
      this.y -= this.dy;
    } else {
      this.y += this.dy;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.dx < 0) {
      ctx.rotate(Math.atan(this.dx/-this.dy) + Math.PI);
    } else{
      ctx.rotate(Math.atan(this.dx/-this.dy));
    }
    ctx.translate(-this.x, -this.y);
    super.draw(ctx);
    ctx.restore();
  }
}

class Game {
  constructor() {

    this.tank = new Tank(this.getXCoordinate(), this.getYCoordinate());

    let x = this.getXCoordinate();
    let y = this.getYCoordinate();

    while (x === this.tank.x) {
      x = this.getXCoordinate();
    }

    this.invader = new Invader(x, y);

    this.invadersHit = 0;

    this.collidesInvader = false;
    this.collidesTank = false;
  }

  writeText(ctx) {
    //outputs all text
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";

    ctx.fillText("0", 2, 597);
    for (let n = 1; n < 10; n++) {
      ctx.fillText(n.toString(), 35 + (40 * (n - 1)), 597);
    }
    ctx.fillText("10", 390, 597);
    ctx.fillText("11", 430, 597);
    ctx.fillText("12", 460, 597);

    for (let n = 1; n < 15; n++) {
      ctx.fillText(n.toString(), 2, 565 - (40 * (n-1)));
    }

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
    let maxY = 600;

    if (intercept < 0) {
      maxY += 40 * Math.abs(intercept);
    }

    while (inc < maxY) {
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

  if (game.checkInProgress) {
    if (game.missile.intersects(game.tank)) {
      game.collidesTank = true;
    }

    if (game.missile.intersects(game.invader)) {
      game.collidesInvader = true;
    }

    if (game.missile.y < 0 || game.missile.y > 600 || game.missile.x < 0 || game.missile.x > 480) {
      game.checkInProgress = false;
      game.collidesTank = false;
      game.collidesInvader = false;
    } else {
      game.missile.move();
      game.missile.draw(ctx);
    }

  }

  if (game.collidesInvader && game.collidesTank) {
    game.invadersHit += 1;
    game.tank = new Tank(game.getXCoordinate(), game.getYCoordinate());
    game.invader = new Invader(game.getXCoordinate(), game.getYCoordinate());
    game.checkInProgress = false;
    game.collidesTank = false;
    game.collidesInvader = false;
  }

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
  headerCtx.fillText("Find the formula for a line that intersects both the spaceship and", 10, 25);
  headerCtx.fillText("UFO so that the missile hits both of them.", 10, 45);
  headerCtx.fillText("Use the controls below to increment or decrement the slope and", 10, 65);
  headerCtx.fillText("intercept, either by 0.1 or 1, and press the rocket to fire!", 10, 85);
  window.requestAnimationFrame(drawHeader);
}
drawHeader();

const interfaceCanvas = document.getElementById("interfaceCanvas")
const interfaceCtx = interfaceCanvas.getContext("2d");

let add = new Image(20, 20);
add.src = "img/plus-solid.svg"
let minus = new Image(20, 20);
minus.src = "img/minus-solid.svg"
let fire = new Image(50, 50);
fire.src = "img/rocket-solid.svg"

function drawInterface() {
  interfaceCtx.clearRect(0, 0, 480, 100);
  interfaceCtx.font = "16px Arial";
  interfaceCtx.fillStyle = "#ffffff";
  interfaceCtx.fillText("y = " + slope.toFixed(1) + "x + " + intercept.toFixed(1), 35, 35);
  interfaceCtx.fillText("score: " + game.invadersHit, 55, 75);
  interfaceCtx.fillText("m", 240, 52);
  interfaceCtx.fillText("b", 242, 82);
  interfaceCtx.fillText("0.1", 265, 27);
  interfaceCtx.fillText("1", 300, 27);
  interfaceCtx.fillText("0.1", 207, 27);
  interfaceCtx.fillText("1", 180, 27);
  interfaceCtx.drawImage(add, 270, 40, 15, 15);
  interfaceCtx.drawImage(add, 270, 70, 15, 15);
  interfaceCtx.drawImage(minus, 210, 40, 15, 15);
  interfaceCtx.drawImage(minus, 210, 70, 15, 15);
  interfaceCtx.drawImage(add, 300, 40, 15, 15);
  interfaceCtx.drawImage(add, 300, 70, 15, 15);
  interfaceCtx.drawImage(minus, 180, 40, 15, 15);
  interfaceCtx.drawImage(minus, 180, 70, 15, 15);
  interfaceCtx.drawImage(fire, 375, 25, 50, 50);

  window.requestAnimationFrame(drawInterface);
}

interfaceCanvas.addEventListener("mousedown", clicked, false);

function clicked(e){
  let x = e.layerX;
  let y = e.layerY;

  if(x>370 && x<430 && y>10 && y<80 && !game.checkInProgress){
    //TODO: make sure missile fires if y starts negative
    if (slope === 0) {
      game.missile = new Missile(0, canvas.height - (intercept * 40), 1, 0);
    } else {
      game.missile = new Missile(0, canvas.height - (intercept * 40), 1/slope, 1);
    }
    game.checkInProgress = true;
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