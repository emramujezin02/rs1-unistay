import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsDashboardComponent } from './analytics-dashboad/analytics-dashboard.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material';

@NgModule({
  declarations: [
    AnalyticsDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AnalyticsRoutingModule,
    MaterialModule
  ],
  exports: [AnalyticsDashboardComponent]
})
export class AnalyticsModule {}