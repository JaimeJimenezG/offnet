import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ChannelFacade } from '../../../facades/channel.facade';
import { ServerFacade } from '../../../facades/server.facade';
import { switchMap } from 'rxjs';
import { Channel } from '../../../models/channel.model';
import { LoginState } from '../../../../public/states/login.state';

@Component({
    selector: 'app-directory',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './directory.component.html',
    styleUrl: './directory.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryComponent implements OnDestroy {
    readonly currentUser = this.loginState.user$.value;
    readonly loaderChannels$ = this.channelFacade.loaderChannels$;
    readonly currentServer$ = this.serverFacade.currentServer$;
    readonly currentChannel$ = this.channelFacade.currentChannel$;
    readonly channels$ = this.currentServer$.pipe(
        switchMap(server => server ? this.channelFacade.channels$ : [])
    )

    constructor(private channelFacade: ChannelFacade, private serverFacade: ServerFacade, private loginState: LoginState) { }

    ngOnDestroy() {
        const currentChannel = this.channelFacade.currentChannel$.value;
        if (currentChannel && this.currentUser) {
            this.channelFacade.leaveChannel(currentChannel.id, this.currentUser.id);
        }
    }

    changeChannel(channel: Channel) {
        if (this.currentUser) {
            console.log('changeChannel', channel, this.currentUser);
            this.channelFacade.joinChannel(channel, this.currentUser);
        }
    }

    isActiveChannel(channel: Channel): boolean {
        return this.channelFacade.currentChannel$.value?.id === channel.id;
    }
}
