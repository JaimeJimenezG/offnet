import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatState } from '../states/chat.state';
import { Message, NewMessageAttrs } from '../models/message.model';
import { User } from '../models/user.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ChatFacade {
    readonly messages$ = this.chatState.messages$;
    readonly loaderMessages$ = this.chatState.loaderMessages$;
    constructor(private chatState: ChatState, private apiService: ApiService) { }

    sendMessage(content: string, user: User): void {
        const newMessage: NewMessageAttrs = {
            channel_id: 1,
            user_id: 1,
            content,
        }
        this.apiService.post<Message>('messages', newMessage).subscribe({
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

    loadMessages(): void {
        this.apiService.get<Message[]>('messages').subscribe({
            next: (mensajes: Message[]) => {
                console.log(mensajes);
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
