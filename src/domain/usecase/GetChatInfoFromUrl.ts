class Response {
    private isValid: boolean = false;
    private username: string = '';
    private roomId: string = '';

    constructor(isValid: boolean, username: string, roomId: string) {
        this.isValid = isValid;
        this.username = username;
        this.roomId = roomId;
    }

    public getIsValid(): boolean {
        return this.isValid;
    }

    public setIsValid(isValid: boolean): void {
        this.isValid = isValid;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public getRoomId(): string {
        return this.roomId;
    }

    public setRoomId(roomId: string): void {
        this.roomId = roomId;
    }
}

class GetChatInfoFromUrl {
  public get(url: URL): Response {
    const username = url.searchParams.get("username");
    const roomId = url.searchParams.get("roomId");
    if (!username || !roomId) {
        return new Response(false, '', '');
    }

    return new Response(true, username, roomId);
  }
}

export {Response, GetChatInfoFromUrl};
