import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../endpoints/message-endpoints/chat-service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ChatMessageViewModel {
  senderId: unknown;
  receiverId?: unknown;
  senderName: string;
  content: string;
  sentAt?: unknown;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit {
  get senderId(): string { return localStorage.getItem('id') ?? ''; }
  //senderId:Number(localStorage.getItem('id'));
  receiverId = '';
  activeUserName = '';

  conversations:any[] = [];
  messages:ChatMessageViewModel[] = [];
  message = '';
  search = '';
  searchResults:any[]=[];
  isTyping=false;
  typingTimeout:any;

  constructor(private chat: ChatService,private http:HttpClient) {}

  ngOnInit() {
const storedId=localStorage.getItem('id');
//if(storedId){
//  this.senderId=Number(storedId);
//}

if (!storedId) { console.error("❌ Nema 'id' u localStorage – login nije spremio userId!"); return; }
//this.senderId=Number(storedId);
    console.log("Sender ID ",this.senderId);

    this.chat.startConnection(this.senderId);

    this.chat.getConversations(this.senderId)
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

  openConversation(c:any) {
    this.receiverId = this.getConversationUserId(c);
    this.activeUserName = this.getConversationDisplayName(c);
    this.isTyping = false;

    this.chat.getMessages(this.senderId, this.receiverId)
      .subscribe(res => this.messages = res.map(message => this.normalizeMessage(message)));
  }

  send() {

    console.log("Klik na dugme detektovan");
    console.log("senderId:", this.senderId, "receiverId:", this.receiverId, "message:", this.message); 
    console.log("chat servis:", this.chat);

    if (!this.message.trim()) return;

    const outgoingText = this.message.trim();

    this.chat.sendMessage(this.senderId, this.receiverId, outgoingText)
      .subscribe({next:(savedMessage)=>{
        this.messages.push(this.normalizeMessage(savedMessage, {
          senderId: this.senderId,
          receiverId: this.receiverId,
          senderName: 'You',
          content: outgoingText
        }));
        this.message = '';
      },
      error: (err) => { console.error("Greška prilikom slanja poruke:", err); }
      });
  }

  onTyping(){
    if(this.receiverId){
      this.chat.sendTyping(this.receiverId,this.senderId);
    }
  }

  isOwnMessage(message: any): boolean {
    return this.isSameUser(this.getMessageSenderId(message), this.senderId);
  }

  isActiveConversation(conversation: any): boolean {
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

  private normalizeMessage(message: any, fallback?: Partial<ChatMessageViewModel>): ChatMessageViewModel {
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

  private getMessageSenderId(message: any): unknown {
    return message?.senderId
      ?? message?.SenderId
      ?? message?.senderUserId
      ?? message?.senderUserID
      ?? message?.SenderUserId
      ?? message?.SenderUserID;
  }

  private getMessageReceiverId(message: any): unknown {
    return message?.receiverId
      ?? message?.ReceiverId
      ?? message?.receiverUserId
      ?? message?.receiverUserID
      ?? message?.ReceiverUserId
      ?? message?.ReceiverUserID;
  }

  private getMessageSenderName(message: any): string {
    return message?.senderName
      ?? message?.SenderName
      ?? message?.senderUsername
      ?? message?.SenderUsername
      ?? '';
  }

  private getMessageContent(message: any): string {
    return message?.content
      ?? message?.Content
      ?? message?.messageText
      ?? message?.MessageText
      ?? '';
  }

  private getConversationUserId(conversation: any): string {
    return this.normalizeUserId(conversation?.userId
      ?? conversation?.UserId
      ?? conversation?.otherUserId
      ?? conversation?.OtherUserId);
  }

  private getConversationDisplayName(conversation: any): string {
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
      c.displayName.toLowerCase().includes(this.search.toLowerCase())
    );
  }

 

searchNewUsers() {
  console.log('Search value: ',this.search);
  if (this.search.length > 2) {
    this.chat.searchUsers(this.search).subscribe(res => {
      this.searchResults = res;
    });
  } else {
    this.searchResults = [];
  }
}

startNewChat(user: any) {
  this.receiverId = this.getConversationUserId(user);
  this.activeUserName = this.getConversationDisplayName(user);
  this.messages = []; // Prazno jer je novi chat
  this.search = '';
  this.searchResults = [];
  
  // Ovdje odmah pozovi backend da vidiš ima li ipak starih poruka
  this.chat.getMessages(this.senderId, this.receiverId)
    .subscribe(res => this.messages = res.map(message => this.normalizeMessage(message)));
}
}
