import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private hubConnection!: signalR.HubConnection;
  private messageReceived$ = new Subject<any>();
  private typing$=new Subject<unknown>();
  private startPromise?: Promise<void>;

  constructor(private http: HttpClient) {}

//startConnection() {
startConnection(userId: number | string) {
  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:5177/hubs/chat?userId=${userId}`, {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();

  this.hubConnection.on('ReceiveMessage', (msg) => {
    this.messageReceived$.next(msg);
  });

  this.hubConnection.on('UserTyping',(senderId)=>{
    this.typing$.next(senderId);
  })

  this.startPromise = this.hubConnection.start()
    .then(() => console.log('✅ SignalR CONNECTED'))
    .catch(err => console.error('❌ SignalR ERROR', err));
}

onUserTyping(callback:(senderId: unknown)=>void){
  this.typing$.subscribe(callback);
}


searchUsers(username: string) {
  return this.http.get<any[]>(`http://localhost:5177/api/chat/search-users?username=${username}`);
}

/*

const token=localStorage.getItem('token');
console.log('Token koji šaljem SingalR-u: ',token);

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5177/hubs/chat', {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();

  this.hubConnection.on('ReceiveMessage', (msg) => {
    this.messageReceived$.next(msg);
  });

  this.hubConnection.start()
    .then(() => console.log('✅ SignalR CONNECTED'))
    .catch(err => console.error('❌ SignalR ERROR', err));
}*/


async sendTyping(receiverId: number | string,senderId:number | string) {
  if (!this.hubConnection) {
    return;
  }

  if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
    await this.startPromise;
  }

  if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
    await this.hubConnection.invoke(
      'Typing',
      this.toHubUserId(receiverId),
      this.toHubUserId(senderId)
    );
  }
}

private toHubUserId(userId: number | string): number | string {
  const numericId = Number(userId);
  return Number.isNaN(numericId) ? userId : numericId;
}

  onMessageReceived(callback: (msg:any)=>void) {
    this.messageReceived$.subscribe(callback);
  }

  getConversations(userId:number | string) {
    return this.http.get<any[]>(`http://localhost:5177/api/chat/conversations/${userId}`);
  }

  getMessages(userId:number | string, otherUserId:number | string) {
    return this.http.get<any[]>(`http://localhost:5177/api/chat/messages?userId=${userId}&otherUserId=${otherUserId}`);
  }

  sendMessage(senderId:number | string, receiverId:number | string, content:string) {
    return this.http.post(`http://localhost:5177/api/messages/send`, {
      senderUserID: senderId,
      receiverUserID: receiverId,
      messageText: content
    });
  }
}
