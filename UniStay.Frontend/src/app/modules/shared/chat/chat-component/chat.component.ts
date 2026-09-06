import { Component, OnInit } from '@angular/core';
import { ChatConversation, ChatService, ChatUserSearchResult } from '../../../../endpoints/message-endpoints/chat-service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface ChatMessageViewModel {
  senderId: unknown;
  receiverId?: unknown;
  senderName: string;
  content: string;
  sentAt?: unknown;
}

interface ChatMessagePayload {
  senderUserId?: unknown;
  senderUserID?: unknown;
  receiverUserId?: unknown;
  receiverUserID?: unknown;
  messageText?: string;
  content?: string;
  sentAt?: unknown;
  SenderId?: unknown;
  senderId?: unknown;
  SenderUserId?: unknown;
  SenderUserID?: unknown;
  ReceiverId?: unknown;
  receiverId?: unknown;
  ReceiverUserId?: unknown;
  ReceiverUserID?: unknown;
  SenderName?: string;
  senderName?: string;
  SenderUsername?: string;
  senderUsername?: string;
  Content?: string;
  MessageText?: string;
  SentAt?: unknown;
  sentAtUtc?: unknown;
  SentAtUtc?: unknown;
}

interface ChatConversationPayload {
  UserId?: unknown;
  userId?: unknown;
  OtherUserId?: unknown;
  otherUserId?: unknown;
  DisplayName?: string;
  displayName?: string;
  Username?: string;
  username?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit {
  get senderId(): string { return localStorage.getItem('id') ?? ''; }
  receiverId = '';
  activeUserName = '';

  conversations: ChatConversation[] = [];
  messages:ChatMessageViewModel[] = [];
  messageForm = new FormGroup({
    message: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(4000)
      ]
    })
  });
  search = '';
  searchResults: ChatUserSearchResult[]=[];
  isTyping=false;
  typingTimeout?: ReturnType<typeof setTimeout>;

  constructor(private chat: ChatService,private http:HttpClient) {}

  ngOnInit() {
const storedId=localStorage.getItem('id');


if (!storedId) { console.error("❌ No 'id' in localStorage – login did not save userId!"); return; }

    this.chat.startConnection();

    this.chat.getConversations()
      .subscribe(res => this.conversations = res);

    this.chat.onMessageReceived((msg) => {
      const message = this.normalizeMessage(msg);
      if (this.belongsToActiveConversation(message)) {
        this.messages.push(message);
      }
    });
    this.chat.onUserTyping((senderId) => {
  if (this.shouldShowTyping(senderId)) {
    this.isTyping = true;

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 1500);
  }
});
  }

  openConversation(c: ChatConversation) {
    this.receiverId = this.getConversationUserId(c);
    this.activeUserName = this.getConversationDisplayName(c);
    this.isTyping = false;

    this.chat.getMessages(this.receiverId)
      .subscribe(res => this.messages = res.map(message => this.normalizeMessage(message)));
  }

  send() {

    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    const outgoingText = this.messageControl.value.trim();

    this.chat.sendMessage(this.receiverId, outgoingText)
      .subscribe({next:(savedMessage)=>{
        this.messages.push(this.normalizeMessage(savedMessage, {
          senderId: this.senderId,
          receiverId: this.receiverId,
          senderName: 'You',
          content: outgoingText
        }));
        this.messageForm.reset({ message: '' });
      },
      error: (err) => { console.error("Error sending message:", err); }
      });
  }

  onTyping(){
    if(this.receiverId){
      this.chat.sendTyping(this.receiverId);
    }
  }

  get messageControl(): FormControl<string> {
    return this.messageForm.controls.message;
  }

  isOwnMessage(message: ChatMessageViewModel): boolean {
    return this.isSameUser(this.getMessageSenderId(message), this.senderId);
  }

  isActiveConversation(conversation: ChatConversation): boolean {
    return this.isSameUser(this.getConversationUserId(conversation), this.receiverId);
  }

  private shouldShowTyping(senderId: unknown): boolean {
    const typingUserId = this.extractTypingSenderId(senderId);

    return this.isSameUser(typingUserId, this.receiverId)
      && !this.isSameUser(typingUserId, this.senderId);
  }

  private belongsToActiveConversation(message: ChatMessageViewModel): boolean {
    if (!this.receiverId) {
      return false;
    }

    const senderIsOtherPerson = this.isSameUser(message.senderId, this.receiverId);
    const receiverIsOtherPerson = this.isSameUser(message.receiverId, this.receiverId);
    const senderIsCurrentUser = this.isSameUser(message.senderId, this.senderId);
    const receiverIsCurrentUser = this.isSameUser(message.receiverId, this.senderId);

    return senderIsOtherPerson || (senderIsCurrentUser && receiverIsOtherPerson) || receiverIsCurrentUser;
  }

  private normalizeMessage(message: ChatMessagePayload, fallback?: Partial<ChatMessageViewModel>): ChatMessageViewModel {
    const senderId = this.getMessageSenderId(message) ?? fallback?.senderId;
    const receiverId = this.getMessageReceiverId(message) ?? fallback?.receiverId;

    return {
      senderId,
      receiverId,
      senderName: this.getMessageSenderName(message) || fallback?.senderName || '',
      content: this.getMessageContent(message) || fallback?.content || '',
      sentAt: message?.sentAt ?? message?.SentAt ?? message?.sentAtUtc ?? message?.SentAtUtc ?? fallback?.sentAt
    };
  }

  private getMessageSenderId(message: ChatMessagePayload): unknown {
    return message?.senderId
      ?? message?.SenderId
      ?? message?.senderUserId
      ?? message?.senderUserID
      ?? message?.SenderUserId
      ?? message?.SenderUserID;
  }

  private getMessageReceiverId(message: ChatMessagePayload): unknown {
    return message?.receiverId
      ?? message?.ReceiverId
      ?? message?.receiverUserId
      ?? message?.receiverUserID
      ?? message?.ReceiverUserId
      ?? message?.ReceiverUserID;
  }

  private getMessageSenderName(message: ChatMessagePayload): string {
    return message?.senderName
      ?? message?.SenderName
      ?? message?.senderUsername
      ?? message?.SenderUsername
      ?? '';
  }

  private getMessageContent(message: ChatMessagePayload): string {
    return message?.content
      ?? message?.Content
      ?? message?.messageText
      ?? message?.MessageText
      ?? '';
  }

  private getConversationUserId(conversation: ChatConversationPayload): string {
    return this.normalizeUserId(conversation?.userId
      ?? conversation?.UserId
      ?? conversation?.otherUserId
      ?? conversation?.OtherUserId);
  }

  private getConversationDisplayName(conversation: ChatConversationPayload): string {
    return conversation?.displayName
      ?? conversation?.DisplayName
      ?? conversation?.username
      ?? conversation?.Username
      ?? '';
  }

  private extractTypingSenderId(payload: unknown): unknown {
    if (payload && typeof payload === 'object') {
      const value = payload as Record<string, unknown>;
      return value['senderId']
        ?? value['SenderId']
        ?? value['senderUserId']
        ?? value['senderUserID']
        ?? value['SenderUserId']
        ?? value['SenderUserID'];
    }

    return payload;
  }

  private isSameUser(first: unknown, second: unknown): boolean {
    return this.normalizeUserId(first) !== ''
      && this.normalizeUserId(first) === this.normalizeUserId(second);
  }

  private normalizeUserId(value: unknown): string {
    return String(value ?? '').trim().toLowerCase();
  }

  

  filteredConversations() {
    return this.conversations.filter(c =>
      this.getConversationDisplayName(c).toLowerCase().includes(this.search.toLowerCase())
    );
  }

 

searchNewUsers() {
  if (this.search.length > 2) {
    this.chat.searchUsers(this.search).subscribe(res => {
      this.searchResults = res;
    });
  } else {
    this.searchResults = [];
  }
}

startNewChat(user: ChatUserSearchResult) {
  this.receiverId = this.getConversationUserId(user);
  this.activeUserName = this.getConversationDisplayName(user);
  this.messages = [];
  this.search = '';
  this.searchResults = [];
  
  this.chat.getMessages(this.receiverId)
    .subscribe(res => this.messages = res.map(message => this.normalizeMessage(message)));
}
}
