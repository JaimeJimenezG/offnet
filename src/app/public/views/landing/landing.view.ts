import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './landing.view.html',
  styleUrl: './landing.view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingView {}
