import User from "./User";

class Message {
    private content: string;
    private user: User;

    constructor(content: string, user: User) {
        this.user = user;
        this.content = content;
    }

    public getUser(): User {
        return this.user;
    }

    public setUser(user: User): void {
        this.user = user;
    }

    public getContent(): string {
        return this.content;
    }

    public setContent(content: string): void {
        this.content = content;
    }
}

export default Message;