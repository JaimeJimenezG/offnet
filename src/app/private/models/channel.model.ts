import { Server } from './server.model';
import { User } from './user.model';

export class Channel {
    id: number;
    server_id: number;
    name: string;
    description: string | null;
    created_at: Date;
    server?: Server;
    connectedUsers?: User[] = [];

    constructor(attrs: ChannelAttrs) {
        this.id = attrs.id;
        this.server_id = attrs.server_id;
        this.name = attrs.name;
        this.description = attrs.description;
        this.created_at = new Date(attrs.created_at);
        this.server = attrs.server;
        this.connectedUsers = attrs.connectedUsers || [];
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
    connectedUsers?: User[];
}

export interface NewChannelAttrs {
    server_id: number;
    name: string;
    description?: string;
}