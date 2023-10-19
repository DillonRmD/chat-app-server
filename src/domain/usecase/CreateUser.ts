import User from "../../Datastructure/User";

class CreateUser {
    public create(displayName: string): User {
        const user = new User();
        user.setDisplayName(displayName);

        return user;
    }
}

export default CreateUser;