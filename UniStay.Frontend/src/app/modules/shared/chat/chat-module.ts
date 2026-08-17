import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat-component/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material';


@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,   
    FormsModule ,    
    ChatRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  exports:[
    ChatComponent
  ]
})
export class ChatModule {}