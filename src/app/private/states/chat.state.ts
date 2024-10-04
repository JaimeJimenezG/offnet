import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Message } from "../models/message.model";

class State {
  messages$ = new BehaviorSubject<Message[] | null>(null);
  loaderMessages$ = new BehaviorSubject<boolean>(false);
}

@Injectable({
  providedIn: "root",
})
export class ChatState {
  private _state = new State();

  constructor() {}

  get messages$() {
    return this._state.messages$;
  }

  get loaderMessages$() {
    return this._state.loaderMessages$;
  }

  listenerMessages(chanel: string) {}

  loadMessages(chanel: string) {
    this._state.loaderMessages$.next(true);
    this._state.loaderMessages$.next(false);
  }

  emitMessage(chanel: string, message: Message) {}
}
