import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPaymentListComponent } from './pages/payment-list/admin-payment-list.component';

const routes: Routes = [
  { path: '', component: AdminPaymentListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule {}
