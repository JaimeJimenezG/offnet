import { User } from "./user.model";
import { Channel } from "./channel.model";

export class Message {
    id: number;
    content: string;
    created_at: Date;
    user_id: number;
    channel_id: number;
    user?: User;
    channel?: Channel;

    constructor(attrs: MessageAttrs) {
        this.id = attrs.id;
        this.content = attrs.content;
        this.created_at = new Date(attrs.created_at);
        this.user_id = attrs.user_id;
        this.channel_id = attrs.channel_id;
    }

    json(): JSON {
        return JSON.parse(JSON.stringify(this));
    }   
}

export interface MessageAttrs {
    id: number;
    content: string;
    created_at: string;
    user_id: number;
    channel_id: number;
    user?: User;
    channel?: Channel;
}

export interface NewMessageAttrs {
    content: string;
    user_id: number;
    channel_id: number;
}