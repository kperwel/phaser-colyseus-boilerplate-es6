import { Game, Scene } from "phaser";
import avatarImage from "./avatar.png";

import { Client } from "colyseus.js";
const client = new Client("ws://127.0.0.1:2657");

// room.listen("players/:id", ({ path: {id, attribute}, value, operation }) => {
//   console.log("attribute:", value, operation, id, attribute);
// });


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

    room.listen("players/:id", ({ path: {id}, operation, value }) => {
        if (operation === 'add') {
            this.avatars[id] = this.add.image(value.x, value.y, "avatar");
        }
        if (operation === 'remove') {
            this.avatars[id].destroy();
        }
    });

    room.listen("players/:id/:attribute", ({ path: {id, attribute}, value, operation }) => {
        if (operation === 'replace') {
            this.avatars[id][attribute] = value;
        }
    });

    this.input.on('pointermove', ({ x, y }) => {
        room.send({ action: "mousemove", x, y })
    });
  }
}


const game = new Game({
  scene: [MainScene]
});

const resizeGameToFullscreen = () => {
  game.resize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resizeGameToFullscreen);
window.addEventListener("load", resizeGameToFullscreen);

// client.getAvailableRooms("game", function(rooms, err) {
//     if (err) console.error(err);
//     rooms.forEach(function(room) {
//       console.log(room.roomId);
//       console.log(room.clients);
//       console.log(room.maxClients);
//       console.log(room.metadata);
//     });
//   });
