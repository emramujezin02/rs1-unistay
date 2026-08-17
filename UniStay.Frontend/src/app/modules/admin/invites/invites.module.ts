import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { InviteFriendModule } from '../../shared/invite-friend/invite-friend.module';
import { InvitesRoutingModule } from './invites-routing.module';
import { InviteListComponent } from './pages/invite-list/invite-list.component';

@NgModule({
  declarations: [
    InviteListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvitesRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    InviteFriendModule
  ]
})
export class InvitesModule {}
