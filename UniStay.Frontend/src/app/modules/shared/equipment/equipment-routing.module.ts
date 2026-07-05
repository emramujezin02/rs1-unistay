import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentAddComponent } from './equipment-add/equipment-add.component';
import { EquipmentUpdateComponent } from './equipment-update/equipment-update.component';
import { EquipmentItemsListComponent } from './equipment-items-list/equipment-items-list.component';
import { EquipmentItemsUpdateService } from '../../../endpoints/equipment-endpoints/equipment-items-update-endpoint.service';
import { EquipmentItemUpdateComponent } from './equipment-items-update/equipment-items-update.component';
import { EquipmentItemCreateComponent } from './equipment-items-create/equipment-items-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'equipment-list', pathMatch: 'full' },
  { path: 'equipment-list', component: EquipmentListComponent },
  { path: 'equipment-add', component: EquipmentAddComponent },
  { path: 'equipment-add/:id', component: EquipmentAddComponent },
  { path: 'equipment-update/:id', component: EquipmentUpdateComponent },
  { path: 'equipment-update', component: EquipmentUpdateComponent },
  { path: 'equipment-items-list/:id',component:EquipmentItemsListComponent},
  { path: 'equipment-items-list',component:EquipmentItemsListComponent},
  { path: 'equipment-items-update/:id',component:EquipmentItemUpdateComponent},
  { path: 'equipment-items-update',component:EquipmentItemUpdateComponent},
  { path: 'equipment-items-create/:id',component:EquipmentItemCreateComponent},
  { path: 'equipment-items-create',component:EquipmentItemCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule {}