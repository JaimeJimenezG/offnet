import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingView } from './public/views/landing/landing.view';
import { ServerFacade } from './private/facades/server.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingView],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'offNet';

  constructor(private serverFacade: ServerFacade) { }

  ngOnInit() {
    this.serverFacade.loadServers();
  }
}
