import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallReservationListComponent } from './pages/hall-reservation-list/hall-reservation-list.component';

const routes: Routes = [
  { path: '', component: HallReservationListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HallReservationsRoutingModule {}
