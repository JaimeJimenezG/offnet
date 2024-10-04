import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-user-actions',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './user-actions.component.html',
    styleUrl: './user-actions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActionsComponent { }
