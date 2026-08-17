import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material';
import { InviteFriendComponent } from './invite-friend.component';

@NgModule({
  declarations: [
    InviteFriendComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    InviteFriendComponent
  ]
})
export class InviteFriendModule {}
