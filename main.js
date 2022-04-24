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
  constructor(x, y) {
    super("img/missile.png", x, y, 10, 30, 0, 0);
    this.displacement = 3; //movement speed
  }

  move() {
    this.dy = -this.displacement;
    super.move();
  }
}

class Tank extends Entity {
  constructor(x, y) {
    super("img/tank.png", x, y, 50, 50, 0, 0);
    this.displacement = 5; //movement speed
    this.missileFired = false;

    //checks for key presses
    document.addEventListener("keydown", this.keyDownHandler.bind(this));
    document.addEventListener("keyup", this.keyUpHandler.bind(this));
  }

  keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      //move to the right
      this.dx = this.displacement;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      //move to the left
      this.dx = -this.displacement;
    } else if (e.key === "Space" || e.key === " ") {
      if (!this.missileFired) {
        this.shootMissile();
      }
    }
  }

  keyUpHandler(e) {
    //end movement
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.dx = 0;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.dx = 0;
    }
  }

  draw(ctx, canvasHeight) {
    super.draw(ctx);

    //animates missiles
    if (this.missileFired) {
      //ensures missile does not go over canvas bounds
      if (this.missile.y < 0) {
        this.missileFired = false;
      }
      this.missile.draw(ctx);
      this.missile.move();
    }
  }

  move(canvasWidth) {
    super.move();

    //ensures tank does not go over canvas bounds
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
    }
  }

  shootMissile() {
    this.missile = new Missile (this.x + 20, this.y - (this.height/2) + 10);
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

    this.tank = new Tank(canvas.width / 2 - 25, canvas.height - 60);
    this.invadersHit = 0; //score
    this.createInvader();
  }

  createInvader() {
    this.invader = new Invader(this.random(0, canvas.width - 50),
      this.random(canvas.height - 600, canvas.height - 150));
  }

  writeText(ctx, invadersMessage) {
    //outputs game message
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(invadersMessage, 8, 20);
  }

  random(lowerBound, upperBound) {
    //returns random number between bounds
    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
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

  let p = 0;

  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.moveTo(x + p, p);
    ctx.lineTo(x + p, canvas.height + p);
  }

  for (let x = 0; x <= canvas.height; x += 40) {
    ctx.moveTo(p, x + p);
    ctx.lineTo(canvas.width + p, x + p);
  }
  ctx.strokeStyle = "black";
  ctx.stroke();

  game.tank.draw(ctx, canvas.height);
  game.tank.move(canvas.width);

  game.playGame(canvas, ctx);

  game.writeText(ctx,"Invaders shot down: " + game.invadersHit);
  window.requestAnimationFrame(draw);
}

draw();
