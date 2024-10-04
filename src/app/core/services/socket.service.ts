import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private SOCKET_IP = 'localhost';
  private SOCKET_PORT = '3000';


  constructor() {}

}
