import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RouterModule } from '@angular/router';
import { ChatModule } from '../shared/chat/chat-module';
import { FormsModule } from '@angular/forms';
import {InvoicesComponent} from './pages/invoices/invoices.component';
import { MaterialModule } from '../shared/material/material';
import { StudentDashboardHomeComponent } from './student-dashboard-home/student-dashboard-home.component';
import { SharedModule } from '../shared/shared.module';
import { ApplyComponent } from './pages/apply/apply.component';
import { InviteFriendModule } from '../shared/invite-friend/invite-friend.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    StudentDashboardHomeComponent,
    InvoicesComponent,
    ApplyComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    RouterModule,
    ChatModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    InviteFriendModule,
    TranslateModule
  ]
})
export class StudentModule { }
