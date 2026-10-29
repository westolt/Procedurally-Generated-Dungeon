import { Application, Container, Graphics } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#374050", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create and add a room to the stage
  const roomContainer = new Container();
  roomContainer.position.set(200, 200);

  app.stage.addChild(roomContainer);

  // Load the floor texture
  const floor = new Graphics().rect(0, 0, 500, 500).fill("#13161b");

  // Load the player texture
  const player = new Graphics().rect(250, 250, 50, 50).fill("#f7d873");

  roomContainer.addChild(floor);
  roomContainer.addChild(player);

  // Listen for animate update
  // app.ticker.add((time) => {
  //   container.rotation -= 0.01 * time.deltaTime;
  // });
})();
