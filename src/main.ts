import Room from "./datastructures/Room";
import User from "./datastructures/User";
import { GetChatInfoFromUrl } from "./domain/usecase/GetChatInfoFromUrl";


const rooms: Room[] = [];
const getChatInfoFromUrl = new GetChatInfoFromUrl();

const server = Bun.serve<{username: string, roomId: string}>({
  port: 80,
  fetch(req, server) {
    const url = new URL(req.url);
    const response = getChatInfoFromUrl.get(url);
    if (!response.getIsValid()) {
      return new Response("Invalid HTTP Request", { status: 401 });
    }

    const username = response.getUsername();
    const roomId = response.getRoomId();
    const successfulUpgrade = server.upgrade(req, {data : { username, roomId }});
    return successfulUpgrade
      ? undefined
      : new Response("Web Socket upgrade error", {status: 400});
  },
  websocket: {
    open(ws) {
      const newUser = new User();
      newUser.setDisplayName(ws.data.username);

      let foundRoom = rooms.find((room: Room) => room.getId() === ws.data.roomId);
      if (!foundRoom) {
        console.log('Creating new room...');
        const newRoom = new Room();
        newRoom.setId(ws.data.roomId);
        newRoom.addUser(newUser);

        rooms.push(newRoom);
        foundRoom = newRoom;
        console.log(foundRoom);
        console.log(rooms);
      } else {
        foundRoom.addUser(newUser);
      }
      
      ws.subscribe(foundRoom.getId());
      server.publish(foundRoom.getId(), `${ws.data.username} has entered the chat`);
    },
    message(ws, message) {
      server.publish(ws.data.roomId, `${ws.data.username}: ${message}`);
    },
    close(ws) {
      ws.unsubscribe(ws.data.roomId);
      server.publish(ws.data.roomId, `${ws.data.username} has left the chat`);
    },
  }
});

console.log(`Listening on ${server.hostname}:${server.port}`);
