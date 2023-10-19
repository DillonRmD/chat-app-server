class User {
    private id: number = -1;
    private displayName: string = '';

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public setDisplayName(displayName: string): void {
        this.displayName = displayName;
    }
}

export default User;