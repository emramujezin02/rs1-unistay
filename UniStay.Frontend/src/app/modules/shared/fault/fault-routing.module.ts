import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaultListComponent } from './fault-list/fault-list.component';
import { FaultAddComponent } from './fault-add/fault-add.component';
import { FaultUpdateComponent } from './fault-update/fault-update.component';

const routes: Routes = [
  { path: '', redirectTo: 'fault-list', pathMatch: 'full' },
  { path: 'fault-list', component: FaultListComponent },
  { path: 'fault-add', component: FaultAddComponent },
  { path: 'fault-add/:id', component: FaultAddComponent },
  { path: 'fault-update', component: FaultUpdateComponent },
  { path: 'fault-update/:id', component: FaultUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaultRoutingModule {}