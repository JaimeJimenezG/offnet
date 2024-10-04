import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingView } from './public/views/landing/landing.view';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingView],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'offNet';
}
