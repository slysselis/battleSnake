// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';
//import chalk from 'chalk';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "Sokos",       // TODO: Your Battlesnake Username
    color: "#0f0e42", // snake color
    head: "replit-mark",  // snake head
    tail: "hook",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  printBoard(gameState.board);
  console.log("\n");

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  const myBody = gameState.you.body;
  const opponents = gameState.board.snakes;
  const food = gameState.board.food;

  // Prevent moving backwards
  if (myNeck.x < myHead.x) isMoveSafe.left = false;
  else if (myNeck.x > myHead.x) isMoveSafe.right = false;
  else if (myNeck.y < myHead.y) isMoveSafe.down = false;
  else if (myNeck.y > myHead.y) isMoveSafe.up = false;

  // Prevent out-of-bounds movement
  if (myHead.x === 0) isMoveSafe.left = false;
  if (myHead.x === boardWidth - 1) isMoveSafe.right = false;
  if (myHead.y === 0) isMoveSafe.down = false;
  if (myHead.y === boardHeight - 1) isMoveSafe.up = false;

  // Prevent self-collision
  myBody.forEach(segment => {
    if (segment.x === myHead.x - 1 && segment.y === myHead.y) isMoveSafe.left = false;
    if (segment.x === myHead.x + 1 && segment.y === myHead.y) isMoveSafe.right = false;
    if (segment.y === myHead.y - 1 && segment.x === myHead.x) isMoveSafe.down = false;
    if (segment.y === myHead.y + 1 && segment.x === myHead.x) isMoveSafe.up = false;
  });

  // Prevent collisions with other snakes
  opponents.forEach(snake => {
    snake.body.forEach(segment => {
      if (segment.x === myHead.x - 1 && segment.y === myHead.y) isMoveSafe.left = false;
      if (segment.x === myHead.x + 1 && segment.y === myHead.y) isMoveSafe.right = false;
      if (segment.y === myHead.y - 1 && segment.x === myHead.x) isMoveSafe.down = false;
      if (segment.y === myHead.y + 1 && segment.x === myHead.x) isMoveSafe.up = false;
    });
  });
  
  // Move towards the closest food if possible
  if (food.length > 0) {
    let closestFood = food.reduce((closest, current) => {
      let closestDist = Math.abs(closest.x - myHead.x) + Math.abs(closest.y - myHead.y);
      let currentDist = Math.abs(current.x - myHead.x) + Math.abs(current.y - myHead.y);
      return currentDist < closestDist ? current : closest;
    });

    if (closestFood.x < myHead.x && isMoveSafe.left) return { move: "left" };
    if (closestFood.x > myHead.x && isMoveSafe.right) return { move: "right" };
    if (closestFood.y < myHead.y && isMoveSafe.down) return { move: "down" };
    if (closestFood.y > myHead.y && isMoveSafe.up) return { move: "up" };
  }

  // Choose a random move from the safe moves
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length === 0) return { move: "down" };

  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

function printBoard(board) {
  const { height, width, food, hazards, snakes } = board;
  let grid = Array.from({ length: height }, () => Array(width).fill('.'));

  // Mark food locations
  food.forEach(f => grid[f.y][f.x] = 'F');

  // Mark hazard locations
  hazards.forEach(h => grid[h.y][h.x] = 'H');

  // Mark snake positions
  snakes.forEach(snake => {
    snake.body.forEach((segment, index) => {
      grid[segment.y][segment.x] = index === 0 ? 'S' : 's';
    });
  });

  // Print the board
  console.log(grid.map(row => row.join(' ')).join('\n'));
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
