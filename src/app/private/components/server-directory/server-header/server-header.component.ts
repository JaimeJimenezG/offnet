import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-server-header',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './server-header.component.html',
    styleUrl: './server-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerHeaderComponent { }
