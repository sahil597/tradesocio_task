import { Component } from '@angular/core';
import { AdminServicesService } from './services/admin-services.service';
declare var require: any;
// const WebSocket = require('ws');
// import * as bson from 'bson';
const bson = require('bson');
import { io } from 'socket.io-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private authService: AdminServicesService) {}

  title = 'my-app';
  // WebSocket details
  webSocketUrl = 'wss://win-devbp.tradesocio.com:2611/8006';
  webSocket: any = io;

  generateToken() {
    const sessionId = '1675250678256';
    const userId = 8006;

    this.authService.generateToken(sessionId, userId).subscribe(
      (response) => {
        console.log('Token generated successfully:', response);
        if (response) {
          this.connectWebSocket(response.Token);
        }
      },
      (error) => {
        console.error('Error generating token:', error);
      }
    );
  }
  connectWebSocket(token: any) {
    this.webSocket = new WebSocket(this.webSocketUrl);

    this.webSocket.addEventListener('open', (event: any) => {
      console.log('WebSocket connection established');
      this.sendFirstRequest(token);
    });

    this.webSocket.addEventListener('message', (event: any) => {
      console.log('WebSocket message:', event.data);
      this.handleWebSocketMessage(event.data);
    });

    this.webSocket.addEventListener('error', (event: any) => {
      console.error('WebSocket error:', event);
    });
  }
  // Function to send the first request
  sendFirstRequest(token: any) {
    // console.log('inside first request');
    try {
      const request = {
        ProfileID: 8006,
        Token: token,
        msgtype: 189,
      };
      // console.log(request,'token')
      const bsonRequest = bson.serialize(request);
      const hexString = bufferToHexString(new Uint8Array(bsonRequest.buffer));
      // console.log(hexString, 'convert');
      this.webSocket.send(bsonRequest);
       }
     catch (error) {
      console.log(error);
      }
  }

  // Function to handle WebSocket messages
  handleWebSocketMessage(data: any) {
    console.log(data);
    const message: any = bson.deserialize(data);
    console.log('Received message:', message);

    // Check if the first request was successful
    if (message.msgtype === 190 && message.Status === 0) {
      this.sendLoginRequest();
    }
  }
  // Function to send the login request
  sendLoginRequest() {
    const loginRequest = {
      UserName: '3127',
      Password: '', // Your password or token if required
      Version: 1.5,
      RTAccountInfo: 1,
      msgtype: 41,
    };
    const bsonLoginRequest = bson.serialize(loginRequest);
    this.webSocket.send(bsonLoginRequest);
  }
}
function bufferToHexString(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
