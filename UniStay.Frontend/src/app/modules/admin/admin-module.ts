import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HallModule } from '../shared/hall/hall.module';
import { FaultModule } from '../shared/fault/fault.module';
import { FormsModule } from '@angular/forms';
import { EquipmentModule } from '../shared/equipment/equipment.module';
import { ChatModule } from '../shared/chat/chat-module';
import { MaterialModule } from '../shared/material/material';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HallModule,
    FaultModule,
    EquipmentModule,
    ChatModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdminModule { }
