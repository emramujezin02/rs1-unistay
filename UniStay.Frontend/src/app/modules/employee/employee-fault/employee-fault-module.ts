import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaultModule } from '../../shared/fault/fault.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FaultModule,
    RouterModule.forChild([
      { path: '', loadChildren: () => import('../../shared/fault/fault.module').then(m => m.FaultModule) }
    ])
  ]
})
export class EmployeeFaultModule {}