import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream = new BehaviorSubject<MediaStream | null>(null);

  constructor() {}


  async generateOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection();
    }

    const oferta = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(oferta);
    return oferta;
  }

  async startCall(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      this.peerConnection = new RTCPeerConnection();

      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      this.peerConnection.ontrack = (event) => {
        this.remoteStream.next(event.streams[0]);
      };

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Aquí deberías enviar la oferta al otro peer a través de tu servidor de señalización
    } catch (error) {
      console.error('Error al iniciar la llamada:', error);
    }
  }

  async respondCall(offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      this.peerConnection = new RTCPeerConnection();
      await this.peerConnection.setRemoteDescription(offer);

      this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      this.peerConnection.ontrack = (event) => {
        this.remoteStream.next(event.streams[0]);
      };

      const respuesta = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(respuesta);

      // Aquí deberías enviar la respuesta al otro peer a través de tu servidor de señalización
    } catch (error) {
      console.error('Error al responder la llamada:', error);
    }
  }

  obtainStreamRemote() {
    return this.remoteStream.asObservable();
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
  }
}