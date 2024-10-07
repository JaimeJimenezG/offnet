import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServerState } from '../../states/server.state';

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
    readonly servers$ = this.serverState.servers$;

    get sideBarActive() {
        return this._sideBarActive;
    }

    constructor(private serverState: ServerState) {
    }


    toggleSideBar() {
        this._sideBarActive = !this._sideBarActive;
    }
}
