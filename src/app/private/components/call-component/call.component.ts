import {
    Component,
    ElementRef,
    ViewChild,
    OnInit,
    OnDestroy,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { WebrtcService } from '../../../core/services/webrtc.service';
  import { SocketService } from '../../../core/services/socket.service';
  import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
  
  @Component({
    selector: 'app-call',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './call.component.html',
    styleUrl: './call.component.scss',
  })
  export class CallComponent implements OnInit, OnDestroy {
    private remoteStreamSubscription: Subscription | null = null;
    private incomingCallSubscription: Subscription | null = null;
  
    isCallActive = false;
    readonly incomingCall$ = this.webrtcService.getIncomingCall();
  
    @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  
    constructor(
      private webrtcService: WebrtcService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.setupRemoteStreamSubscription();
    }
  
    ngOnDestroy(): void {
      this.unsubscribeAll();
      this.webrtcService.closeConnection();
    }
  
    async startCall(): Promise<void> {
      this.isCallActive = true;
      console.log('Iniciando llamada...');
      await this.webrtcService.startCall();
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
  
    goBack(): void {
      this.endCall(); // Aseguramos que la llamada se termine al salir
      this.router.navigate(['/home']);
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
  
    private unsubscribeAll(): void {
      if (this.remoteStreamSubscription) {
        this.remoteStreamSubscription.unsubscribe();
      }
      if (this.incomingCallSubscription) {
        this.incomingCallSubscription.unsubscribe();
      }
    }
  }