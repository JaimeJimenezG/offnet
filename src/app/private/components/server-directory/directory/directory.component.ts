import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class DirectoryComponent { }
