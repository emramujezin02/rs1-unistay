import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BedAssignmentListComponent } from './pages/bed-assignment-list/bed-assignment-list.component';

const routes: Routes = [
  { path: '', component: BedAssignmentListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BedAssignmentsRoutingModule {}
