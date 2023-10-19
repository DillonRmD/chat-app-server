import Room from "../../BusinessObject/Room";

class CreateRoom {
    public create(roomId: string): Room {
        const room = new Room();
        room.setId(roomId);

        return room;
    }
}

export default CreateRoom;