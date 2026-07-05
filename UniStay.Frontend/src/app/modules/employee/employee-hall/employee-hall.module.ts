import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HallModule } from '../../shared/hall/hall.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HallModule,
    RouterModule.forChild([
      { path: '', loadChildren: () => import('../../shared/hall/hall.module').then(m => m.HallModule) }
    ])
  ]
})
export class EmployeeHallModule {}