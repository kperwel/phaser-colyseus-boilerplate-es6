const colyseus = require("colyseus");
const http = require("http");
const WebSocket = require("uws");

const gameServer = new colyseus.Server({
  server: http.createServer(),
  engine: WebSocket.Server
});

class GameRoom extends colyseus.Room {
  // this room supports only 4 clients connected
  constructor() {
    super();
    this.maxClients = 4;
  }

  onInit(options) {
    this.clock.setTimeout(() => this.broadcast("Oh sheet!"), 100)
    this.setState({
      players: {}
    });
  }

  onJoin(client) {
    this.state.players[ client.sessionId ] = {
      x: 0,
      y: 0
    };
  }

  onLeave(client) {
    delete this.state.players[ client.sessionId ];
  }

  onMessage (client, data) {
    if (data.action === "mousemove") {
      this.state.players[ client.sessionId ].x = data.x;
      this.state.players[ client.sessionId ].y = data.y;
    }
  }

  onDispose() {
    console.log("Dispose BasicRoom");
  }
}

gameServer.register("game", GameRoom);

gameServer.listen(2657);
