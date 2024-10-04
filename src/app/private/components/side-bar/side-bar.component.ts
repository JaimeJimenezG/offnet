import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
    
    get sideBarActive() {
        return this._sideBarActive;
    }

    constructor() {
    }


    toggleSideBar() {
        this._sideBarActive = !this._sideBarActive;
    }
}
