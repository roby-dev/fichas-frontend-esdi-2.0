import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  readonly socket = inject(Socket);

  connect(token: string) {
    if (this.socket.ioSocket.connected) {
      this.socket.disconnect();
    }

    this.socket.ioSocket.auth = { token };
    this.socket.ioSocket.io.opts.reconnection = true;
    this.socket.ioSocket.io.opts.reconnectionAttempts = 10;
    this.socket.ioSocket.io.opts.reconnectionDelay = 1000;
    this.socket.ioSocket.io.opts.reconnectionDelayMax = 5000;
    this.socket.connect();
  }

  disconnect() {
    if (this.socket.ioSocket.connected) {
      this.socket.disconnect();
    }
  }

  isConnected(): boolean {
    return this.socket.ioSocket.connected;
  }
}
