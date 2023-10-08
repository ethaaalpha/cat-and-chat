import { Player } from "./player";

export class SocketServer {
  id: number;
  wbSocket: WebSocket
  players: Map<number, Player>;
  localPlayer: Player;
  constructor(players: Map<number, Player>, localPlayer: Player) {
    this.wbSocket = new WebSocket("ws://localhost:3000");
    this.players = players;
    this.localPlayer = localPlayer;
    this.id = -1;
    this.#makeServerRuntime();
  }

  #makeServerRuntime (){
    this.wbSocket.addEventListener('open', (event) => {
      console.log("Browser connected to server !");
      this.#makeLoopUpdate();
      this.#handleServerListener();
    });
  }

  #sendMessage(message: any)
  {
    this.wbSocket.send(JSON.stringify(message));
  }

  #handleServerListener () {
    this.wbSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.event)
      {
        case "init":
          this.players.set(message.id, this.players.get(-1)!);
          this.id = message.id;
          this.players.delete(-1);
          break;
        case "add":
          const values = JSON.parse(message.data);
          if (values.x === "default") {
            this.players.set(message.id, new Player(250, 250));
          }
          else {
            this.players.set(message.id, new Player(values.x, values.y));
          }
          break;
        case "remove":
          this.players.delete(message.id);
          break;
        case "update":
          const value = JSON.parse(message.data);
          this.players.get(message.id)?.changeCoords(value.x, value.y);
          break;
      }
    }
  }

  async #makeLoopUpdate() {
    while (1)
    {
      await new Promise(resolve => setTimeout(resolve, 1));
      console.log("SENDED");
      this.wbSocket.send(JSON.stringify({event: "update", data: {
          name: this.localPlayer.name,
          x: this.localPlayer.X,
          y: this.localPlayer.Y,
          id: this.id}}));
    }
  }
}