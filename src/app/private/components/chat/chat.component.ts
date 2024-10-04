import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from '../../models/message.model';
import { ChatState } from '../../states/chat.state';
import { LoginState } from '../../../public/states/login.state';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, AfterViewInit {
  private CHANEL = 'messages';

  private _controls = {
    message: new FormControl('', [Validators.required]),
  };

  private _form = new FormGroup(this._controls);

  readonly messages$ = this.chatState.messages$;

  readonly loaderMessages$ = this.chatState.loaderMessages$;

  readonly user = this.loginState.user$.value;

  @ViewChild('chat') private chat!: ElementRef;

  constructor(private chatState: ChatState, private loginState: LoginState) {}

  get controls() {
    return this._controls;
  }

  get form() {
    return this._form;
  }

  ngOnInit() {
    this.chatState.loadMessages(this.CHANEL);
    this.chatState.listenerMessages(this.CHANEL);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this._form.valid) {
      const message = new Message({
        text: this._controls.message.value!,
        user: this.user!,
        timestamp: new Date(),
      });
      // TODO: may have to specify the the channel to send the message
      this.chatState.emitMessage(this.CHANEL, message);
      this._form.reset();
    }
  }

  scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }
}
