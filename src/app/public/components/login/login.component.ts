import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginState } from '../../states/login.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private _controls = {
    username: new FormControl('', [Validators.required]),
    // password: new FormControl('', [Validators.required])
  };

  private _loginForm = new FormGroup(this._controls);

  get controls() {
    return this._controls;
  }

  get loginForm() {
    return this._loginForm;
  }

  tryToLogin() {
    if (this._loginForm.valid) {
      this.loginState.tryLogin({
        name: this._controls.username.value!,
        //password: this._controls.password.value as string
      });
      this.navigateToHome();
    }
  }

  constructor(private loginState: LoginState, private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
