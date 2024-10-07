import { User } from "./user.model";
import { Channel } from "./channel.model";

export class Server {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
    owner_id: number;

    constructor(attrs: ServerAttrs) {
        this.id = attrs.id;
        this.name = attrs.name;
        this.description = attrs.description;
        this.created_at = new Date(attrs.created_at);
        this.owner_id = attrs.owner_id;
    }

    json(): JSON {
        return JSON.parse(JSON.stringify(this));
    }   
}

export interface ServerAttrs {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    owner_id: number;
    owner?: User;
    channels?: Channel[];
}

export interface NewServerAttrs {
    name: string;
    description?: string;
    owner_id: number;
}