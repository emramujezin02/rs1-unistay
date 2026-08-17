import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebhookListComponent } from './pages/webhook-list/webhook-list.component';

const routes: Routes = [
  { path: '', component: WebhookListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebhooksRoutingModule {}
