import { Injectable, OnInit } from '@angular/core';
import { Channel, NewChannelAttrs } from '../models/channel.model';
import { ApiService } from '../../core/services/api.service';
import { ChannelState } from '../states/channel.state';
import { SocketService } from '../../core/services/socket.service';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ChannelFacade {
    readonly channels$ = this.channelState.channels$;
    readonly currentChannel$ = this.channelState.currentChannel$;
    readonly loaderChannels$ = this.channelState.loaderChannels$;

    constructor(private channelState: ChannelState, private apiService: ApiService, private socketService: SocketService) {
        this.setupSocketListeners();
    }

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

    joinChannel(channel: Channel, user: User): void {
        if (!channel.connectedUsers?.some(u => u.id === user.id)) {
            this.socketService.emit('joinChannel', { channelId: channel.id, user });
            this.channelState.channels$.value?.forEach(channel => {
                if (channel.id === channel.id) {
                    channel.connectedUsers = [...(channel.connectedUsers || []), user];
                    this.channelState.channels$.next(this.channelState.channels$.value);
                }
            });
        }
        this.setCurrentChannel(channel);
    }

    leaveChannel(channelId: number, userId: number): void {
        this.socketService.emit('leaveChannel', { channelId, userId });
    }

    private setupSocketListeners(): void {
        this.socketService.on('joinChannel').subscribe((response: any) => {
            console.log('joinChannel', response);
            this.channelState.channels$.value?.forEach(channel => {
                console.log('channel', channel);
                console.log('response', response);
                if (channel.id === response.channelId) {
                    if (!channel.connectedUsers?.some(u => u.id === response.user.id)) {
                        channel.connectedUsers = [...(channel.connectedUsers || []), response.user];
                        this.channelState.channels$.next(this.channelState.channels$.value);
                    }
                }
            });
        });

        this.socketService.on('leaveChannel').subscribe(({ channelId, userId }) => {
            console.log('leaveChannel', channelId, userId);
            const currentChannel = this.channelState.currentChannel$.value;
            if (currentChannel && currentChannel.id === channelId) {
                currentChannel.connectedUsers = currentChannel.connectedUsers?.filter(u => u.id !== userId);
                this.channelState.currentChannel$.next(currentChannel);
            }
        });
    }
}
