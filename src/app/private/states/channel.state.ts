import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Channel } from '../models/channel.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ChannelState {
    channels$ = new BehaviorSubject<Channel[] | null>(null);
    currentChannel$ = new BehaviorSubject<Channel | null>(null);
    loaderChannels$ = new BehaviorSubject<boolean>(false);
    constructor() { }
}
