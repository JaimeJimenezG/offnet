import { Injectable } from '@angular/core';
import { ChatState } from '../states/chat.state';
import { Message, NewMessageAttrs } from '../models/message.model';
import { User } from '../models/user.model';
import { ApiService } from '../../core/services/api.service';
import { ServerFacade } from './server.facade';
import { ChannelFacade } from './channel.facade';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatFacade {
    readonly messages$ = this.chatState.messages$;
    readonly loaderMessages$ = this.chatState.loaderMessages$;

    constructor(private chatState: ChatState, private apiService: ApiService, private channelFacade: ChannelFacade) { }

    sendMessage(content: string, user: User): void {
        if (this.channelFacade.currentChannel$.value?.id) {
            const newMessage: NewMessageAttrs = {
                channel_id: this.channelFacade.currentChannel$.value?.id,
                user_id: 1,
                content,
            }
            this.apiService.post<Message>('messages', newMessage).pipe(take(1)).subscribe({
                next: (message: Message) => {
                    const mensajesActuales = this.chatState.messages$.value;
                    if (mensajesActuales) {
                        this.chatState.messages$.next([...mensajesActuales, message]);
                    } else {
                        this.chatState.messages$.next([message]);
                    }
                }
            });
        }
    }

    loadMessagesByChannel(channelId: number): void {
        this.apiService.get<Message[]>(`messages/channels/${channelId}`).pipe(take(1)).subscribe({
            next: (mensajes: Message[]) => {
                this.chatState.messages$.next(mensajes);
                this.chatState.loaderMessages$.next(false);
            },
            error: (error) => {
                console.error('Error al cargar los mensajes:', error);
                this.chatState.loaderMessages$.next(false);
            }
        });
    }
}
