import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material/material';
import { PublicLayoutLandingComponent } from './public-layout-landing/public-layout-landing.component';
import { PublicLayoutRoutingModule } from './public-layout-routing.module';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

@NgModule({
  declarations: [
    PublicLayoutComponent,
    PublicLayoutLandingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PublicLayoutRoutingModule
  ]
})
export class PublicLayoutModule {}
