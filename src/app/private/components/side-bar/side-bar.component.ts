import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServerState } from '../../states/server.state';
import { Server } from '../../models/server.model';
import { ServerFacade } from '../../facades/server.facade';

@Component({
    selector: 'app-side-bar',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './side-bar.component.html',
    styleUrl: './side-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent {
    private _sideBarActive = true;
    readonly servers$ = this.serverFacade.servers$;

    get sideBarActive() {
        return this._sideBarActive;
    }

    constructor(private serverFacade: ServerFacade) {
    }


    toggleSideBar() {
        this._sideBarActive = !this._sideBarActive;
    }

    changeServer(server: Server) {
        this.serverFacade.setCurrentServer(server);
    }
}
