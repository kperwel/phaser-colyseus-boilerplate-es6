import { Game, Scene, AUTO } from "phaser";
import avatarImage from "./avatar.png";

import { Client } from "colyseus.js";
const client = new Client("ws://127.0.0.1:2657");
class MainScene extends Scene {
  constructor() {
    super("mainScene");
    this.avatars = {};
  }
  preload() {
    this.load.image("avatar", avatarImage);
  }
  create() {
    const room = client.join("game");

    room.listen("players/:id", ({ path: { id }, operation, value }) => {
      if (operation === "add") {
        this.avatars[id] = this.add.image(value.x, value.y, "avatar");
      }
      if (operation === "remove") {
        this.avatars[id].destroy();
      }
    });

    room.listen("players/:id/:attribute", ({ path: { id, attribute }, value, operation }) => {
      if (operation === "replace") {
        this.avatars[id][attribute] = value;
      }
    });

    this.input.on("pointermove", ({ x, y }) => {
      room.send({ action: "mousemove", x, y });
    });
  }
}

const game = new Game({
  scene: [MainScene],
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
});

const resizeGameToFullscreen = () => {
  game.resize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resizeGameToFullscreen);
window.addEventListener("load", resizeGameToFullscreen);
