import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicRoomDetailComponent } from './pages/room-detail/public-room-detail.component';
import { PublicRoomsComponent } from './pages/rooms/public-rooms.component';

const routes: Routes = [
  { path: '', component: PublicRoomsComponent },
  { path: 'rooms', component: PublicRoomsComponent },
  { path: 'rooms/:id', component: PublicRoomDetailComponent },
  { path: ':id', component: PublicRoomDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
