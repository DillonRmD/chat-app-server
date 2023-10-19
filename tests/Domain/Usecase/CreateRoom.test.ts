import { expect, test } from "bun:test";
import CreateRoom from "../../../src/Domain/Usecase/CreateRoom";
import Room from "../../../src/BusinessObject/Room";

const ROOM_ID = 'Test1234';

test('Room Creation returns Room with Correct ID', () => {
    const createRoom = new CreateRoom();
    
    const actual = createRoom.create(ROOM_ID);

    const expected = new Room();
    expected.setId(ROOM_ID);
    expect(actual).toEqual(expected);
});