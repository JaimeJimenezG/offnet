import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream = new BehaviorSubject<MediaStream | null>(null);
  private incomingOffer: RTCSessionDescriptionInit | null = null;
  private incomingCall = new BehaviorSubject<boolean>(false);

  constructor(private socketService: SocketService) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socketService.on('offer').subscribe((offer: RTCSessionDescriptionInit) => {
      this.handleIncomingOffer(offer);
    });

    this.socketService.on('answer').subscribe((answer: RTCSessionDescriptionInit) => {
      this.handleAnswer(answer);
    });

    this.socketService.on('ice-candidate').subscribe((candidate: RTCIceCandidateInit) => {
      this.handleIceCandidate(candidate);
    });
  }

  async startCall(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.peerConnection = new RTCPeerConnection();
  
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
  
      this.peerConnection.ontrack = (event) => {
        this.remoteStream.next(event.streams[0]);
      };
  
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socketService.emit('ice-candidate', event.candidate);
        }
      };
  
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socketService.emit('offer', offer);
    } catch (error) {
      console.error('Error al iniciar la llamada:', error);
    }
  }

  async respondCall(): Promise<void> {
  if (!this.incomingOffer) {
    console.error('No hay una oferta entrante para responder');
    return;
  }

  try {
    this.peerConnection = new RTCPeerConnection();

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log('Recibiendo track remoto:', event.streams[0]);
      this.remoteStream.next(event.streams[0]);
    };

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.incomingOffer));

    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localStream.getTracks().forEach(track => {
      if (this.peerConnection && this.localStream) {
        this.peerConnection.addTrack(track, this.localStream);
      }
    });

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.socketService.emit('answer', answer);

    this.incomingOffer = null;
    this.incomingCall.next(false);
  } catch (error) {
    console.error('Error al responder la llamada:', error);
  }
}

  handleIncomingOffer(offer: RTCSessionDescriptionInit): void {
    this.incomingOffer = offer;
    this.incomingCall.next(true);
    console.log('Llamada entrante recibida');
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(answer));
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  obtainStreamRemote() {
    return this.remoteStream.asObservable();
  }

  getIncomingCall() {
    return this.incomingCall.asObservable();
  }

  closeConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.remoteStream.next(null);
    this.incomingCall.next(false);
    this.incomingOffer = null;
  }
}