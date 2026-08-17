import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentsRoutingModule } from './payments-routing.module';
import { AdminPaymentListComponent } from './pages/payment-list/admin-payment-list.component';
import { PaymentsFacade } from './data/payments.facade';
import { PaymentsStore } from './data/payments.store';

@NgModule({
  declarations: [
    AdminPaymentListComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule
  ],
  providers: [
    PaymentsFacade,
    PaymentsStore
  ]
})
export class PaymentsModule {}
