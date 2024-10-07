import { Injectable } from '@angular/core';
import { ServerState } from '../states/server.state';
import { Server, NewServerAttrs } from '../models/server.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ServerFacade {
    readonly servers$ = this.serverState.servers$;
    readonly currentServer$ = this.serverState.currentServer$;
    readonly loaderServers$ = this.serverState.loaderServers$;

    constructor(private serverState: ServerState, private apiService: ApiService) { }

    loadServers(): void {
        this.serverState.loaderServers$.next(true);
        this.apiService.get<Server[]>('servers').subscribe({
            next: (servers: Server[]) => {
                console.log('Servidores obtenidos:', servers);
                this.serverState.servers$.next(servers);
                this.serverState.loaderServers$.next(false);
            },
            error: (error) => {
                console.error('Error al cargar los servidores:', error);
                this.serverState.loaderServers$.next(false);
            }
        });
    }

    createServer(newServer: NewServerAttrs): void {
        this.apiService.post<Server>('servers', newServer).subscribe({
            next: (server: Server) => {
                const servidoresActuales = this.serverState.servers$.value;
                if (servidoresActuales) {
                    this.serverState.servers$.next([...servidoresActuales, server]);
                } else {
                    this.serverState.servers$.next([server]);
                }
            },
            error: (error) => {
                console.error('Error al crear el servidor:', error);
            }
        });
    }

    getServerById(id: number): void {
        this.apiService.get<Server>(`servers/${id}`).subscribe({
            next: (server: Server) => {
                this.serverState.currentServer$.next(server);
            },
            error: (error) => {
                console.error(`Error al obtener el servidor con id ${id}:`, error);
            }
        });
    }

    setCurrentServer(server: Server): void {
        this.serverState.currentServer$.next(server);
    }
}