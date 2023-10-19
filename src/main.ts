import Room from "./BusinessObject/Room";
import CreateRoom from "./Domain/Usecase/CreateRoom";
import CreateUser from "./Domain/Usecase/CreateUser";
import { GetChatInfoFromUrl } from "./Domain/Usecase/GetChatInfoFromUrl";


const rooms: Room[] = [];
const getChatInfoFromUrl = new GetChatInfoFromUrl();
const createRoom = new CreateRoom();
const createUser = new CreateUser();

const server = Bun.serve<{username: string, roomId: string}>({
  port: 443,
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
      const newUser = createUser.create(ws.data.username);

      let room = rooms.find((room: Room) => room.getId() === ws.data.roomId);
      if (!room) {
        console.log('Creating new room...');
        room = createRoom.create(ws.data.roomId);
        room.addUser(newUser);
        rooms.push(room);
      }
      
      ws.subscribe(room.getId());
      server.publish(room.getId(), `${ws.data.username} has entered the chat`);
    },
    message(ws, message) {
      server.publish(ws.data.roomId, `${ws.data.username}: ${message}`);
    },
    close(ws) {
      const room = rooms.find((room: Room) => room.getId() === ws.data.roomId);
      room?.removeUser(ws.data.username);

      ws.unsubscribe(ws.data.roomId);
      server.publish(ws.data.roomId, `${ws.data.username} has left the chat`);
    },
  }
});

console.log(`Listening on ${server.hostname}:${server.port}`);
