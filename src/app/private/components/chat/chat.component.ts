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
import { LoginState } from '../../../public/states/login.state';
import { ChatFacade } from '../../facades/chat.facade';

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

  readonly messages$ = this.chatFacade.messages$;

  readonly loaderMessages$ = this.chatFacade.loaderMessages$;

  readonly user = this.loginState.user$.value;

  @ViewChild('chat') private chat!: ElementRef;

  constructor(private chatFacade: ChatFacade, private loginState: LoginState) { }

  get controls() {
    return this._controls;
  }

  get form() {
    return this._form;
  }

  ngOnInit() {
    this.chatFacade.loadMessages();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this._form.valid) {
      this.chatFacade.sendMessage(this._controls.message.value!, this.user!);

      this._form.reset();
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }
}
