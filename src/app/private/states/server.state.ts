import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Server } from "../models/server.model";

@Injectable({
    providedIn: "root",
})
export class ServerState {
    servers$ = new BehaviorSubject<Server[] | null>(null);
    currentServer$ = new BehaviorSubject<Server | null>(null);
    loaderServers$ = new BehaviorSubject<boolean>(false);

    get servers(): Server[] | null {
        return this.servers$.value;
    }

    get currentServer(): Server | null {
        return this.currentServer$.value;
    }
    
    
}