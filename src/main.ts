import Room from "./datastructures/Room";

const chatRoom = new Room();
console.log(chatRoom.getId());

const server = Bun.serve<{username: string}>({
  websocket: {
    open(ws) {
      ws.subscribe(chatRoom.getId());
      server.publish(chatRoom.getId(), `${ws.data.username} has entered the chat`);
    },
    message(ws, message) {
      server.publish(chatRoom.getId(), `${ws.data.username}: ${message}`);
    },
    close(ws) {
      ws.unsubscribe(chatRoom.getId());
      server.publish(chatRoom.getId(), `${ws.data.username} has left the chat`);
    },
  },
  fetch(req, server) {
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    if (!username) {
      return new Response("User name required", { status: 401 });
    }

    const successfulUpgrade = server.upgrade(req, {data : { username }});
    return successfulUpgrade
      ? undefined
      : new Response("Web Socket upgrade error", {status: 400});
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
