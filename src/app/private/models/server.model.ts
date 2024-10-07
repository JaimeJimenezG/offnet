import { User } from "./user.model";
import { Channel } from "./channel.model";

export class Server {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
    owner_id: number;
    image_url: string;

    constructor(attrs: ServerAttrs) {
        this.id = attrs.id;
        this.name = attrs.name;
        this.description = attrs.description;
        this.created_at = new Date(attrs.created_at);
        this.owner_id = attrs.owner_id;
        this.image_url = attrs.image_url;
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
    image_url: string;
    owner?: User;
    channels?: Channel[];
}

export interface NewServerAttrs {
    name: string;
    description?: string;
    owner_id: number;
    image_url: string;
}