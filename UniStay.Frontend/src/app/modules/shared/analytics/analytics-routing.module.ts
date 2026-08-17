import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsDashboardComponent } from './analytics-dashboad/analytics-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'analytics-dashboard', pathMatch: 'full' },
  { path: 'analytics-dashboard', component: AnalyticsDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {}