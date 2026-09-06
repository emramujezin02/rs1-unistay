import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface ChatUserSearchResult {
  id?: number;
  userID?: number;
  username?: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface ChatConversation {
  otherUserId?: number;
  otherUserID?: number;
  userId?: number;
  userID?: number;
  username?: string;
  displayName?: string;
  email?: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface ChatMessage {
  senderUserId?: number;
  senderUserID?: number;
  receiverUserId?: number;
  receiverUserID?: number;
  messageText?: string;
  content?: string;
  sentAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {

  private hubConnection!: signalR.HubConnection;
  private messageReceived$ = new Subject<ChatMessage>();
  private typing$ = new Subject<unknown>();
  private startPromise?: Promise<void>;

  constructor(private http: HttpClient) {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5177/hubs/chat', {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (msg: ChatMessage) => {
      this.messageReceived$.next(msg);
    });

    this.hubConnection.on('UserTyping', (senderId: unknown) => {
      this.typing$.next(senderId);
    });

    this.startPromise = this.hubConnection.start()
      .then(() => undefined)
      .catch(err => console.error('SignalR connection error', err));
  }

  onUserTyping(callback: (senderId: unknown) => void): void {
    this.typing$.subscribe(callback);
  }

  searchUsers(username: string): Observable<ChatUserSearchResult[]> {
    return this.http.get<ChatUserSearchResult[]>(`http://localhost:5177/api/student/chat/search-users?username=${username}`);
  }

  async sendTyping(receiverId: number | string): Promise<void> {
    if (!this.hubConnection) {
      return;
    }

    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      await this.startPromise;
    }

    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke(
        'Typing',
        this.toHubUserId(receiverId)
      );
    }
  }

  private toHubUserId(userId: number | string): number | string {
    const numericId = Number(userId);
    return Number.isNaN(numericId) ? userId : numericId;
  }

  onMessageReceived(callback: (msg: ChatMessage) => void): void {
    this.messageReceived$.subscribe(callback);
  }

  getConversations(): Observable<ChatConversation[]> {
    return this.http.get<ChatConversation[]>('http://localhost:5177/api/student/chat/conversations');
  }

  getMessages(otherUserId: number | string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`http://localhost:5177/api/student/chat/messages?otherUserId=${otherUserId}`);
  }

  sendMessage(receiverId: number | string, content: string): Observable<object> {
    return this.http.post('http://localhost:5177/api/student/chat/send', {
      receiverUserId: receiverId,
      messageText: content
    });
  }
}
