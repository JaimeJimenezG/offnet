import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { ServerDirectoryComponent } from '../../components/server-directory/server-directory.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ChatComponent,
        SideBarComponent,
        TopBarComponent,
        ServerDirectoryComponent
    ],
    templateUrl: './home.view.html',
    styleUrl: './home.view.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeView {
    
}
