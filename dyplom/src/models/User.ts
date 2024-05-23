import { UserSettings } from "./Settings";

export interface User {
    _id: string,
    username: string,
    createdAt: Date,
    updatedAt: Date,
    userSettings: UserSettings | {}
}

