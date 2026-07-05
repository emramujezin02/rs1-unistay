import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material/material';
import { PublicRoutingModule } from './public-routing.module';
import { PublicRoomDetailComponent } from './pages/room-detail/public-room-detail.component';
import { PublicRoomsComponent } from './pages/rooms/public-rooms.component';

@NgModule({
  declarations: [
    PublicRoomsComponent,
    PublicRoomDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    PublicRoutingModule
  ]
})
export class PublicModule {}
