// src/app/modules/shared/hall/hall-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallListComponent } from './hall-list/hall-list.component';
import { HallAddComponent } from './hall-add/hall-add.component';
import { HallUpdateComponent } from './hall-update/hall-update.component';

const routes: Routes = [
  { path: '', redirectTo: 'hall-list', pathMatch: 'full' },
  { path: 'hall-list', component: HallListComponent },
  { path: 'hall-add', component: HallAddComponent },         
  { path: 'hall-add/:id', component: HallAddComponent } ,    
  { path: 'hall-update',component:HallUpdateComponent},
  { path: 'hall-update/:id', component:HallUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HallRoutingModule {}