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
    if (this.dy === 0) {
      ctx.rotate(90 * (Math.PI/180));
    }
    else {
      ctx.rotate(Math.atan(this.dx/-this.dy));
    }
    ctx.translate(-this.x, -this.y);
    super.draw(ctx);
    ctx.restore();
  }
}

class Tank extends Entity {
  constructor(x, y) {
    super("img/tank.png", x, y, 50, 50, 0, 0);
    this.missileFired = false;

    //checks for key presses
    document.addEventListener("keydown", this.keyDownHandler.bind(this));
  }

  keyDownHandler(e) {
    if (e.key === "Space" || e.key === " ") {
      if (!this.missileFired) {
        this.shootMissile();
      }
    }
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

  shootMissile() {
    this.missile = new Missile (this.x + 20, this.y + 10, 1, 0);
    this.missileFired = true;
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
  constructor(canvas) {

    this.tank = new Tank(this.getXCoordinate(), this.getYCoordinate());

    this.invadersHit = 0; //score
    this.createInvader();
  }

  createInvader() {
    this.invader = new Invader(this.getXCoordinate(), this.getYCoordinate());
  }

  writeText(ctx, invadersMessage) {
    //outputs all text
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(invadersMessage, 161, 25);

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

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let game = new Game(canvas);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  game.tank.draw(ctx, canvas.height);

  game.playGame(canvas, ctx);

  game.writeText(ctx,"Invaders shot down: " + game.invadersHit);
  window.requestAnimationFrame(draw);
}

draw();
