import { expect, test } from "bun:test";
import CreateUser from "../../../src/Domain/Usecase/CreateUser";
import User from "../../../src/Datastructure/User";

const USERNAME = 'TestName';
const createUser = new CreateUser();

test('Created user has correct username', () => {
    const actual = createUser.create(USERNAME);

    const expected = new User();
    expected.setDisplayName(USERNAME);
    expect(actual).toEqual(expected);
});