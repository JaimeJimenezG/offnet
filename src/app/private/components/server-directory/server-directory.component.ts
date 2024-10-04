import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServerHeaderComponent } from './server-header/server-header.component';
import { DirectoryComponent } from './directory/directory.component';
import { UserActionsComponent } from './user-actions/user-actions.component';

@Component({
    selector: 'app-server-directory',
    standalone: true,
    imports: [
        CommonModule,
        ServerHeaderComponent,
        DirectoryComponent,
        UserActionsComponent
    ],
    templateUrl: './server-directory.component.html',
    styleUrl: './server-directory.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerDirectoryComponent { }
