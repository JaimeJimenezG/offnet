// create a login state

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../private/models/user.model';

class State {
  user = new BehaviorSubject<User | null>(null);
}

@Injectable({
  providedIn: 'root',
})
export class LoginState {
  private _onLogout$ = new Observable<boolean>();

  private _state = new State();

  constructor() {}

  // Getters and setters
  get onLogout$(): Observable<boolean> {
    return this._onLogout$;
  }

  get user$() {
    return this._state.user;
  }

  // Methods
  tryLogin(user: User) {
    // TODO: Implement login logic
    this._state.user.next(user);
  }

  reset() {
    this._state = new State();
  }
}
