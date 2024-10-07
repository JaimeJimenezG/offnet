import { Injectable } from '@angular/core';
import { Channel, NewChannelAttrs } from '../models/channel.model';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { ChannelState } from '../states/channel.state';

@Injectable({
    providedIn: 'root'
})
export class ChannelFacade {
    readonly channels$ = this.channelState.channels$;
    readonly currentChannel$ = this.channelState.currentChannel$;
    readonly loaderChannels$ = this.channelState.loaderChannels$;

    constructor(private channelState: ChannelState, private apiService: ApiService) { }

    loadChannels(serverId: number): void {
        this.channelState.loaderChannels$.next(true);
        this.apiService.get<Channel[]>(`servers/${serverId}/channels`).subscribe({
            next: (channels: Channel[]) => {
                console.log('Canales obtenidos:', channels);
                this.channelState.channels$.next(channels);
                this.channelState.loaderChannels$.next(false);
            },
            error: (error) => {
                console.error('Error al cargar los canales:', error);
                this.channelState.loaderChannels$.next(false);
            }
        });
    }

    createChannel(newChannel: NewChannelAttrs): void {
        this.apiService.post<Channel>('channels', newChannel).subscribe({
            next: (channel: Channel) => {
                const canalesActuales = this.channelState.channels$.value;
                if (canalesActuales) {
                    this.channelState.channels$.next([...canalesActuales, channel]);
                } else {
                    this.channelState.channels$.next([channel]);
                }
            },
            error: (error) => {
                console.error('Error al crear el canal:', error);
            }
        });
    }

    getChannelById(id: number): void {
        this.apiService.get<Channel>(`channels/${id}`).subscribe({
            next: (channel: Channel) => {
                this.channelState.currentChannel$.next(channel);
            },
            error: (error) => {
                console.error(`Error al obtener el canal con id ${id}:`, error);
            }
        });
    }

    setCurrentChannel(channel: Channel): void {
        this.channelState.currentChannel$.next(channel);
    }
}
