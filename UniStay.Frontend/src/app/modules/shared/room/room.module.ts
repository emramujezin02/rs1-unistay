import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomRoutingModule } from './room-routing.module';


@NgModule({
  declarations: [
    RoomListComponent,
    RoomDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RoomRoutingModule,
    MaterialModule
  ],
  exports: [
    RoomListComponent,
    RoomDetailsComponent
  ]
})
export class RoomModule {
}