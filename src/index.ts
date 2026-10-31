import { Application, Container, Graphics } from "pixi.js";
import { dungeon, type DungeonRow } from "./dungeon";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#fdfdfd", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create a world and a dungeon
  const world = new Container();

  async function createDungeon() {
    for (let i = 0; i < 10; ++i) {
      const row: DungeonRow = dungeon[i]!;
      for (let j = 0; j < 10; j++) {
        if (row[j] == 0) {
          const dungeonWall = new Graphics()
            .rect(j * 100, i * 100, 100, 100)
            .fill("#374050");
          world.addChild(dungeonWall);
        } else {
          const dungeonFloor = new Graphics()
            .rect(j * 100, i * 100, 100, 100)
            .fill("#1c2129");
          world.addChild(dungeonFloor);
        }
      }
    }
  }

  await createDungeon();

  let worldPosX = app.screen.width / 2 - 250;
  let worldPosY = app.screen.height / 2 - 250;

  world.position.set(worldPosX, worldPosY);

  app.stage.addChild(world);

  // Create palyer
  const playerPosX = app.screen.width / 2 - 25;
  const playerPosY = app.screen.height / 2 - 25;

  const player = new Graphics()
    .rect(playerPosX, playerPosY, 50, 50)
    .fill("#f7d873");

  app.stage.addChild(player);

  // Track mouse clicks and save new world positions
  app.stage.eventMode = "static";

  let newPosX = worldPosX;
  let newPosY = worldPosY;

  app.stage.onclick = (event) => {
    newPosX = worldPosX - (event.global.x - playerPosX);
    newPosY = worldPosY - (event.global.y - playerPosY);
  };

  // Move world towards new positions
  app.ticker.add((time) => {
    const speed = 0.1 * time.deltaTime;
    const playerSize = 50;
    const tileSize = 100;

    // Calculate next X position
    if (Math.abs(worldPosX - newPosX) > 1) {
      const nextWorldX = worldPosX + (newPosX - worldPosX) * speed;

      const left = Math.floor((playerPosX - nextWorldX) / tileSize);
      const right = Math.floor(
        (playerPosX + playerSize - nextWorldX - 1) / tileSize,
      );

      const top = Math.floor((playerPosY - worldPosY) / tileSize);
      const bottom = Math.floor(
        (playerPosY + playerSize - worldPosY - 1) / tileSize,
      );

      let canMove = true;

      for (let y = top; y <= bottom; y++) {
        if (dungeon[y]?.[left] !== 1 || dungeon[y]?.[right] !== 1) {
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
      const right = Math.floor(
        (playerPosX + playerSize - worldPosX - 1) / tileSize,
      );

      const top = Math.floor((playerPosY - nextWorldY) / tileSize);
      const bottom = Math.floor(
        (playerPosY + playerSize - nextWorldY - 1) / tileSize,
      );

      let canMove = true;

      for (let x = left; x <= right; x++) {
        if (dungeon[top]?.[x] !== 1 || dungeon[bottom]?.[x] !== 1) {
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
