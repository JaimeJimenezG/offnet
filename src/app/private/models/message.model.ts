import { User } from "./user.model";

export class Message {
    text: string;
    user: User;
    timestamp: Date;
    //password: string;
    constructor(attrs: MessageAttrs) {
        this.text = attrs.text;
        this.user = attrs.user;
        this.timestamp = attrs.timestamp;
    }

    json(): JSON {
        return JSON.parse(JSON.stringify(this));
    }   
}

export interface MessageAttrs {
    text: string;
    user: User;
    timestamp: Date;
}
