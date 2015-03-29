// General properties
var WIDTH = 850;
var HEIGHT = 600;
var TO_RADIANS = Math.PI / 180;

// Total width of the canvas minus the scoreboard
var ARENA_WIDTH = 600;

// Canvas setup
var canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// In other languages it is basically a "Class"
// In javascript it is a "Constructor"

// Dynamic constructor for the images
// consist of translation, rotation and scaling
// It also includes collision and rendering
function ImageHandler() {

	this.position = {
		x: 0,
		y: 0
	};

	this.scale = {
		x: 1,
		y: 1
	};

	this.collision = {
		x: 30,
		y: 30
	};

	var angle = 0,
		init = false,
		image = new Image();

	image.onload = function () {
		init = true;
	}

	this.setSource = function (src) {
		image.src = src;
	}

	this.setAngle = function (ang) {
		angle = ang;
	}

	this.getAngle = function () {
		return angle;
	}

	this.getImage = function () {
		return image;
	}

	this.getWidth = function () {
		return image.width;
	}

	this.getHeight = function () {
		return image.height;
	}

	this.draw = function () {
		if (init) {
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.scale(this.scale.x, this.scale.y);
			ctx.rotate(angle * TO_RADIANS);
			ctx.drawImage(image, -(image.width * 0.5), -(image.height * 0.5));
			ctx.restore();
		}
	}

	this.hasCollidedWith = function (obj) {
		if (this.position.x <= (obj.position.x + this.collision.x) && obj.position.x <= (this.position.x + this.collision.x) &&
			this.position.y <= (obj.position.y + this.collision.y) && obj.position.y <= (this.position.y + this.collision.y)) {
			return true;
		}
		else return false;
	}
}

// Key properties
var keysDown = {};

// Initiates when the browser is ready ("init" is a function)
window.addEventListener("load", init);

// Handles the keyboard functions ("keyPress" is a function)
window.addEventListener("keydown", keyPress, true);

// References/Sources for the asssets
var headOpenSrc = "snakeAsset/head_open.png";
var headCloseSrc = "snakeAsset/head_close.png";
var tailSrc = "snakeAsset/tail.png";
var bodySrc = "snakeAsset/body.png";

// References for the keys using ASCII
var LEFT_ARROW = 37,
	RIGHT_ARROW = 39,
	UP_ARROW = 38,
	DOWN_ARROW = 40;

var	KEY_W = 87,
	KEY_A = 65,
	KEY_S = 83,
	KEY_D = 68;

// Instances of the needed images
var background = new ImageHandler();
background.setSource("snakeAsset/bg1.png");

// Length of the snake
var snakeLength = 5;
var snake = [];
var dead = false;

// Nodes for the snake
var snakeHeadNode;
var snakeTailNode;
var snakeTailIndx;

// An Enumerator that Handles 
// the direction of the snake
var snakeDirection = {
	left: 1,
	right: 2,
	up: 3,
	down: 4
};
var snakeDir;

// Snake food
var snakeFood = new ImageHandler();
snakeFood.setSource("snakeAsset/food.png");

// When snake hit the trigger, it will open its mouth
var snakeTrigger = new ImageHandler();

// Game score
var score = 0;

// Check if the snake updates its move
var moved = false;

// Distance between snake tiles
var snakeTileOffset = 2;

// Prevent the snake from bumping the edge of the arena
var arenaCollisionOffset = 10;

// Initialization
function init() {
	// Background properties
	background.position.x = WIDTH * 0.5;
	background.position.y = HEIGHT * 0.5;

	// Game properties
	score = 0;
	snakeLength = 5;

	// Snake food collision size
	snakeFood.collision.x = 20;
	snakeFood.collision.y = 20;

	// Collision box attached to the head of the snake
	// Used for snake's mouth opening
	snakeTrigger.collision.x = 30;
	snakeTrigger.collision.y = 30;

	// Initialize Snake
	initSnake();

	// Start spawining food
	spawnFood();
}

function initSnake() {
	// Populate snake array
	for (i = 0; i < snakeLength; i++) {
		var tmpSnake = new ImageHandler();
		tmpSnake.setSource(bodySrc);
		tmpSnake.position.x = 50 + ((snakeLength -1) -i) * (30 + snakeTileOffset);
		tmpSnake.position.y = HEIGHT * 0.1;
		snake.push(tmpSnake);
	}

	// Initialize snake properties
	snakeDir = snakeDirection.right;
	snakeTailIndx = snakeLength - 1;
	snakeHeadNode = snake[0];
	snakeTailNode = snake[snakeTailIndx];

	// Make sure the tail and head node 
	// has separate images from the body
	snakeTailNode.setSource(tailSrc);
	snakeHeadNode.setSource(headCloseSrc);
}

function respawnSnake() {
	score = 0;
	snakeLength = 5;

	for (i = 0; i < snakeLength; i++) {
		snake[i].setSource(bodySrc);
		snake[i].scale.x = 1;
		snake[i].scale.y = 1;
		snake[i].setAngle(0);
		snake[i].position.x = 50 + ((snakeLength - 1) - i) * (30 + snakeTileOffset);
		snake[i].position.y = HEIGHT * 0.1;
	}
	
	snakeDir = snakeDirection.right;
	snakeTailIndx = snakeLength - 1;
	snakeHeadNode = snake[0];
	snakeTailNode = snake[snakeTailIndx];

	snakeTailNode.setSource(tailSrc);
	snakeHeadNode.setSource(headCloseSrc);
}

function snakeMove() {
	switch (snakeDir) {
		case snakeDirection.up:
			//alert("Key Up was pressed");
			snakeTailNode.position.x = snakeHeadNode.position.x;
			snakeTailNode.position.y = snakeHeadNode.position.y - snakeHeadNode.getHeight() - snakeTileOffset;
			snakeTailNode.setAngle(270);

			snakeHeadNode.scale.x = 1;
			snakeHeadNode.setSource(bodySrc);
			snakeHeadNode = snakeTailNode;
			snakeHeadNode.setSource(headCloseSrc);
			break;

		case snakeDirection.down:
			//alert("Key Down was pressed");
			snakeTailNode.position.x = snakeHeadNode.position.x;
			snakeTailNode.position.y = snakeHeadNode.position.y + snakeHeadNode.getHeight() + snakeTileOffset;
			snakeTailNode.setAngle(90);

			snakeHeadNode.scale.x = 1;
			snakeHeadNode.setSource(bodySrc);
			snakeHeadNode = snakeTailNode;
			snakeHeadNode.setSource(headCloseSrc);
			break;

		case snakeDirection.left:
			//alert("Key Left was pressed");
			snakeTailNode.position.x = snakeHeadNode.position.x - snakeHeadNode.getWidth() - snakeTileOffset;
			snakeTailNode.position.y = snakeHeadNode.position.y;
			snakeTailNode.setAngle(0);

			snakeHeadNode.setSource(bodySrc);
			snakeHeadNode = snakeTailNode;
			snakeHeadNode.setSource(headCloseSrc);

			// Flip the image
			snakeHeadNode.scale.x = -1;
			break;

		case snakeDirection.right:
			//alert("Key Right was pressed");
			snakeTailNode.position.x = snakeHeadNode.position.x + snakeHeadNode.getWidth() + snakeTileOffset;
			snakeTailNode.position.y = snakeHeadNode.position.y;
			snakeTailNode.setAngle(0);

			snakeHeadNode.setSource(bodySrc);
			snakeHeadNode = snakeTailNode;
			snakeHeadNode.setSource(headCloseSrc);

			// Flip the image
			snakeHeadNode.scale.x = 1;
			break;
	}

	moved = true;
	snakeTailIndx--;
	if (snakeTailIndx < 0)
		snakeTailIndx = snakeLength - 1;
	snakeTailNode = snake[snakeTailIndx];
	snakeTailNode.setSource(tailSrc);

	// Check if snake collided with a food
	checkFoodCollision();
}

function checkArenaBounds() {
	if (snakeDir == snakeDirection.right && snakeHeadNode.position.x > (ARENA_WIDTH - arenaCollisionOffset) ||
		snakeDir == snakeDirection.left && snakeHeadNode.position.x < arenaCollisionOffset ||
		snakeDir == snakeDirection.down && snakeHeadNode.position.y > (HEIGHT - arenaCollisionOffset) ||
		snakeDir == snakeDirection.up && snakeHeadNode.position.y < arenaCollisionOffset) {
		dead = true;
	}
}

function checkFoodCollision() {
	if (snakeTrigger.hasCollidedWith(snakeHeadNode)) {
		snakeHeadNode.setSource(headOpenSrc);
	}

	if (snakeFood.hasCollidedWith(snakeHeadNode)) {
		addScore(1);
		spawnFood();
	}
	else
		checkSelfCollision();
}

function checkSelfCollision() {
	for (i = 0; i < snake.length; i++) {
		if (snakeHeadNode != snake[i] && snakeHeadNode.hasCollidedWith(snake[i])) {
			reset();
		}
	}
}

function spawnFood() {
	snakeFood.position.x = 30 + Math.round((Math.random() * (ARENA_WIDTH - 60)));
	snakeFood.position.y = 30 + Math.round((Math.random() * (HEIGHT - 60)));
	snakeTrigger.position.x = snakeFood.position.x;
	snakeTrigger.position.y = snakeFood.position.y;
}

function addScore(num) {
	score += num;
	addSnakeLength();
}

function showText(text, x, y, r, g, b) {
	ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	ctx.font = "30px Helvetica";
	ctx.fillText(text, x, y);
}

function reset() {
	dead = false;
	snake = snake.slice(0, 5);

	respawnSnake();
	spawnFood();
}

// Spawn snake body's image outside the canvas
// and wait for the array to loop and update
// its real position
function addSnakeLength() {
	var tmpBody = new ImageHandler();
	tmpBody.position.x = 1000;
	tmpBody.position.y = 1000;
	snake.push(tmpBody);
	snakeLength = snake.length;
}

// Game loop
var update = function (dt) {
	checkArenaBounds();

	if (dead)
		reset();
};

function keyPress(e) {
	if (moved) {
		switch (e.keyCode) {
			case UP_ARROW: case KEY_W:
				//alert("Key Up was pressed");
				if (snakeDir != snakeDirection.down)
					snakeDir = snakeDirection.up;
				break;

			case DOWN_ARROW: case KEY_S:
				//alert("Key Down was pressed");
				if (snakeDir != snakeDirection.up)
					snakeDir = snakeDirection.down;
				break;

			case LEFT_ARROW: case KEY_A:
				//alert("Key Left was pressed");
				if (snakeDir != snakeDirection.right)
					snakeDir = snakeDirection.left;
				break;

			case RIGHT_ARROW: case KEY_D:
				//alert("Key Right was pressed");
				if (snakeDir != snakeDirection.left)
					snakeDir = snakeDirection.right;
				break;
		}
	}
	moved = false;
}

var render = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	background.draw();
	snakeFood.draw();

	for (i = 0; i < snake.length; i++) {
		snake[i].draw();
	}

	showText("Score", 680, 70, 0, 0, 255);
	showText(score, 710, 105, 0, 0, 255);

	showText("High Score", 650, 270, 0, 0, 255);
	showText(score, 710, 305, 0, 0, 255);
};

var then = Date.now();

var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);

	render();
	then = now;
};

setInterval(snakeMove, 100);
setInterval(main, 1);