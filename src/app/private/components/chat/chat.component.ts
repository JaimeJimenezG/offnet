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
import { SocketService } from '../../../core/services/socket.service';

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
  private incomingCallSubscription: Subscription | null = null;

  readonly form = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  readonly messages$ = this.chatFacade.messages$;
  readonly loaderMessages$ = this.chatFacade.loaderMessages$;
  readonly user = this.loginState.user$.value;
  readonly currentChannel$ = this.channelFacade.currentChannel$;

  showPinnedMessages = false;
  incomingCall = false;
  isCallActive = false;

  @ViewChild('chat', { static: true }) private chatElement!: ElementRef<HTMLDivElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private chatFacade: ChatFacade,
    private loginState: LoginState,
    private channelFacade: ChannelFacade,
    private webrtcService: WebrtcService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.setupChannelSubscription();
    this.setupMessagesSubscription();
    this.setupRemoteStreamSubscription();
    this.setupIncomingCallSubscription();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.unsubscribeAll();
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
  }

  async startCall(): Promise<void> {
    console.log('Iniciando llamada...');
    await this.webrtcService.startCall();
    this.isCallActive = true;
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (this.localVideo && this.localVideo.nativeElement) {
      this.localVideo.nativeElement.srcObject = localStream;
      console.log('Stream local asignado al elemento de video');
    }
  }
  
  async respondCall(): Promise<void> {
    console.log('Respondiendo llamada...');
    await this.webrtcService.respondCall();
    this.isCallActive = true;
    this.incomingCall = false;
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (this.localVideo && this.localVideo.nativeElement) {
      this.localVideo.nativeElement.srcObject = localStream;
      console.log('Stream local asignado al elemento de video');
    }
  }
  
  endCall(): void {
    console.log('Finalizando llamada...');
    this.webrtcService.closeConnection();
    this.isCallActive = false;
    if (this.localVideo && this.localVideo.nativeElement) {
      this.localVideo.nativeElement.srcObject = null;
    }
    if (this.remoteVideo && this.remoteVideo.nativeElement) {
      this.remoteVideo.nativeElement.srcObject = null;
    }
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

  private setupRemoteStreamSubscription(): void {
    this.remoteStreamSubscription = this.webrtcService.obtainStreamRemote().subscribe(
      stream => {
        console.log('Stream remoto recibido en el componente:', stream);
        if (stream && this.remoteVideo && this.remoteVideo.nativeElement) {
          this.remoteVideo.nativeElement.srcObject = stream;
          console.log('Stream remoto asignado al elemento de video');
        }
      }
    );
  }

  private setupIncomingCallSubscription(): void {
    this.incomingCallSubscription = this.webrtcService.getIncomingCall().subscribe(
      incoming => {
        this.incomingCall = incoming;
        if (incoming) {
          console.log('Llamada entrante');
          // Aquí podrías mostrar una notificación o un diálogo para el usuario
        }
      }
    );
  }

  private scrollToBottom(): void {
    const chatElement = this.chatElement.nativeElement;
    chatElement.scrollTo({
      top: chatElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  private unsubscribeAll(): void {
    if (this.remoteStreamSubscription) {
      this.remoteStreamSubscription.unsubscribe();
    }
    if (this.incomingCallSubscription) {
      this.incomingCallSubscription.unsubscribe();
    }
  }
}