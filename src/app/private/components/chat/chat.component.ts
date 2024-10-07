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
import { WebrtcService } from '../../../core/services/webrtc.servce';

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
  private remoteStreamSubscription: Subscription | null = null;

  readonly form = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  readonly messages$ = this.chatFacade.messages$;
  readonly loaderMessages$ = this.chatFacade.loaderMessages$;
  readonly user = this.loginState.user$.value;
  readonly currentChannel$ = this.channelFacade.currentChannel$;

  offer: RTCSessionDescriptionInit | null = null;

  showPinnedMessages = false;

  @ViewChild('chat', { static: true }) private chatElement!: ElementRef<HTMLDivElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private chatFacade: ChatFacade,
    private loginState: LoginState,
    private channelFacade: ChannelFacade,
    private webrtcService: WebrtcService
  ) { }

  ngOnInit(): void {
    this.channelFacade.currentChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(channel => {
        if (channel?.id) {
          this.chatFacade.loadMessagesByChannel(channel.id);
        }
      });

    this.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => this.scrollToBottom());
      });

    this.remoteStreamSubscription = this.webrtcService.obtainStreamRemote().subscribe(
      stream => {
        if (stream && this.remoteVideo) {
          this.remoteVideo.nativeElement.srcObject = stream;
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.remoteStreamSubscription) {
      this.remoteStreamSubscription.unsubscribe();
    }
    this.webrtcService.closeConnection();
  }

  sendMessage(): void {
    if (this.form.valid && this.user) {
      this.chatFacade.sendMessage(this.form.get('message')?.value!, this.user);
      this.form.reset();
    }
  }

  togglePinnedMessages(): void {
    this.showPinnedMessages = !this.showPinnedMessages;
    // Aquí deberías cargar los mensajes fijados si showPinnedMessages es true
  }

  private scrollToBottom(): void {
    const chatElement = this.chatElement.nativeElement;
    chatElement.scrollTo({
      top: chatElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  async startCall(): Promise<void> {
    await this.webrtcService.startCall();
    this.offer = await this.webrtcService.generateOffer();
    console.log('Oferta generada:', this.offer);  }

  async respondCall(): Promise<void> {
    if (this.offer) {
      await this.webrtcService.respondCall(this.offer);
    } else {
      console.error('No hay oferta disponible para responder');
    }
  }
}