import { Application, Container, Graphics } from "pixi.js";
import { dungeonMap, generateDungeonMap, pointList } from "./algorithms/dungeon";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#fdfdfd", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create the world container
  const world = new Container();

  generateDungeonMap();

  function drawDungeon() {
    for (let i = 0; i < 20; ++i) {
      const row = dungeonMap[i]!;
      for (let j = 0; j < 20; j++) {
        if (row[j] == 0) {
          const dungeonWall = new Graphics().rect(j * 100, i * 100, 100, 100).fill("#374050");
          world.addChild(dungeonWall);
        } else {
          const dungeonFloor = new Graphics().rect(j * 100, i * 100, 100, 100).fill("#1c2129");
          world.addChild(dungeonFloor);
        }
      }
    }
  }

  // Draw the dungeon map
  drawDungeon();

  // Get a random spawn point for the player
  const randomPoint = Math.floor(Math.random() * pointList.size);
  const spawnPoint = pointList.get(randomPoint);
  console.log("spawnPoint: ", spawnPoint);

  if (!spawnPoint) {
    throw new Error("Could not get a spawn point.");
  }

  let worldPosX = app.screen.width / 2 - spawnPoint.x * 100 - 50;
  let worldPosY = app.screen.height / 2 - spawnPoint.y * 100 - 50;

  world.position.set(worldPosX, worldPosY);

  app.stage.addChild(world);

  // Create palyer
  const playerPosX = app.screen.width / 2 - 25;
  const playerPosY = app.screen.height / 2 - 25;

  const player = new Graphics().rect(playerPosX, playerPosY, 50, 50).fill("#f7d873");

  app.stage.addChild(player);

  // Track mouse clicks and calculate the target world position
  app.stage.eventMode = "static";

  let newPosX = worldPosX;
  let newPosY = worldPosY;

  app.stage.onclick = (event) => {
    newPosX = worldPosX - (event.global.x - playerPosX - 25);
    newPosY = worldPosY - (event.global.y - playerPosY - 25);
  };

  // Move the world towards the target position
  app.ticker.add((time) => {
    // Adjust movement speed based on frame time
    const speed = 0.2 * time.deltaTime;
    const playerSize = 50;
    const tileSize = 100;

    // Calculate next X position
    if (Math.abs(worldPosX - newPosX) > 1) {
      const nextWorldX = worldPosX + (newPosX - worldPosX) * speed;

      const left = Math.floor((playerPosX - nextWorldX) / tileSize);
      const right = Math.floor((playerPosX + playerSize - nextWorldX - 1) / tileSize);

      const top = Math.floor((playerPosY - worldPosY) / tileSize);
      const bottom = Math.floor((playerPosY + playerSize - worldPosY - 1) / tileSize);

      let canMove = true;

      // Check whether the player can move horizontally without hitting a wall
      for (let y = top; y <= bottom; y++) {
        if (dungeonMap[y]?.[left] !== 1 || dungeonMap[y]?.[right] !== 1) {
          canMove = false;
          break;
        }
      }

      if (canMove) {
        worldPosX = nextWorldX;
        world.x = worldPosX;
      }
    }

    // Calculate next Y position
    if (Math.abs(worldPosY - newPosY) > 1) {
      const nextWorldY = worldPosY + (newPosY - worldPosY) * speed;

      const left = Math.floor((playerPosX - worldPosX) / tileSize);
      const right = Math.floor((playerPosX + playerSize - worldPosX - 1) / tileSize);

      const top = Math.floor((playerPosY - nextWorldY) / tileSize);
      const bottom = Math.floor((playerPosY + playerSize - nextWorldY - 1) / tileSize);

      let canMove = true;

      // Check whether the player can move vertically without hitting a wall
      for (let x = left; x <= right; x++) {
        if (dungeonMap[top]?.[x] !== 1 || dungeonMap[bottom]?.[x] !== 1) {
          canMove = false;
          break;
        }
      }

      if (canMove) {
        worldPosY = nextWorldY;
        world.y = worldPosY;
      }
    }
  });
})();
