import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { HallModule } from '../shared/hall/hall.module';
import { FaultModule } from '../shared/fault/fault.module';
import { EquipmentModule } from '../shared/equipment/equipment.module';
import { ChatModule } from '../shared/chat/chat-module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material';
import { SharedModule } from '../shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { EmployeeRoomsComponent } from './employee-rooms/employee-rooms.component';
import { EmployeeStudentsComponent } from './employee-students/employee-students.component';
import { InviteFriendModule } from '../shared/invite-friend/invite-friend.module';

@NgModule({
  declarations: [
EmployeeDashboardComponent,
EmployeeRoomsComponent,
EmployeeStudentsComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    HallModule,
    FaultModule,
    EquipmentModule,
    ChatModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    MatSortModule,
    InviteFriendModule
  ]
})
export class EmployeeModule { }
