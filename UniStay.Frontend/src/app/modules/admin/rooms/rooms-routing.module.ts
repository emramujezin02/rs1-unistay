import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomFormComponent } from './pages/room-form/room-form.component';
import { RoomListComponent } from './pages/room-list/room-list.component';

const routes: Routes = [
  { path: '', component: RoomListComponent },
  { path: 'new', component: RoomFormComponent },
  { path: ':id/edit', component: RoomFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule {}
