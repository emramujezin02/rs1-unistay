import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EquipmentModule } from '../../shared/equipment/equipment.module';



@NgModule({
  imports: [
    CommonModule,
    EquipmentModule, 
    RouterModule.forChild([
      { path: '', loadChildren: () => import('../../shared/equipment/equipment.module').then(m => m.EquipmentModule) }
    ])
  ]
})
export class AdminEquipmentModule {}