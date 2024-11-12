import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginState } from '../../../public/states/login.state';
import { ChatFacade } from '../../facades/chat.facade';
import { ChannelFacade } from '../../facades/channel.facade';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { WebrtcService } from '../../../core/services/webrtc.service';
import { SocketService } from '../../../core/services/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  readonly form = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  readonly messages$ = this.chatFacade.messages$;
  readonly loaderMessages$ = this.chatFacade.loaderMessages$;
  readonly user = this.loginState.user$.value;
  readonly currentChannel$ = this.channelFacade.currentChannel$;
  readonly incomingCall$ = this.webrtcService.getIncomingCall();
  
  showPinnedMessages = false;
  isCallActive = false;

  @ViewChild('chat', { static: true }) private chatElement!: ElementRef<HTMLDivElement>;

  constructor(
    private chatFacade: ChatFacade,
    private loginState: LoginState,
    private channelFacade: ChannelFacade,
    private webrtcService: WebrtcService,
    private router: Router,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.setupChannelSubscription();
    this.setupMessagesSubscription();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage(): void {
    if (this.form.valid && this.user) {
      this.chatFacade.sendMessage(this.form.get('message')?.value!, this.user);
      this.form.reset();
    }
  }

  togglePinnedMessages(): void {
    this.showPinnedMessages = !this.showPinnedMessages;
  }

  private setupChannelSubscription(): void {
    this.channelFacade.currentChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(channel => {
        if (channel?.id) {
          this.chatFacade.loadMessagesByChannel(channel.id);
        }
      });
  }

  private setupMessagesSubscription(): void {
    this.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => this.scrollToBottom());
      });
  }

  private scrollToBottom(): void {
    const chatElement = this.chatElement.nativeElement;
    chatElement.scrollTo({
      top: chatElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  startCall(): void {
    this.router.navigate(['/call']);
  }
}