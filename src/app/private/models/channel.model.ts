import { Server } from './server.model';

export class Channel {
    id: number;
    server_id: number;
    name: string;
    description: string | null;
    created_at: Date;
    server?: Server;

    constructor(attrs: ChannelAttrs) {
        this.id = attrs.id;
        this.server_id = attrs.server_id;
        this.name = attrs.name;
        this.description = attrs.description;
        this.created_at = new Date(attrs.created_at);
        this.server = attrs.server;
    }

    json(): JSON {
        return JSON.parse(JSON.stringify(this));
    }
}

export interface ChannelAttrs {
    id: number;
    server_id: number;
    name: string;
    description: string | null;
    created_at: string;
    server?: Server;
}

export interface NewChannelAttrs {
    server_id: number;
    name: string;
    description?: string;
}