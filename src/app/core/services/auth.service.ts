import { Injectable } from '@angular/core';
import { LoginState } from '../../public/states/login.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private loginState: LoginState
  ) {} // ...
  public isAuthenticated(): boolean {
    const user = this.loginState.user$?.value;
    // true or false
    return !!user;
  }
}
