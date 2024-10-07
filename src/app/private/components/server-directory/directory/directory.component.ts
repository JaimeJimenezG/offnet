import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelFacade } from '../../../facades/channel.facade';
import { ServerFacade } from '../../../facades/server.facade';
import { switchMap } from 'rxjs';
import { Channel } from '../../../models/channel.model';

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
export class DirectoryComponent {
  
    readonly loaderChannels$ = this.channelFacade.loaderChannels$;
    readonly currentServer$ = this.serverFacade.currentServer$;
    readonly channels$ = this.currentServer$.pipe(
        switchMap(server => server ? this.channelFacade.channels$ : [])
    )
    constructor(private channelFacade: ChannelFacade, private serverFacade: ServerFacade) { }

    changeChannel(channel: Channel) {
        this.channelFacade.setCurrentChannel(channel);
    }
}
