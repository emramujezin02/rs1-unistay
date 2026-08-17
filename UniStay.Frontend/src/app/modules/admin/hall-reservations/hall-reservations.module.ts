import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { HallReservationsFacade } from './data/hall-reservations.facade';
import { HallReservationsStore } from './data/hall-reservations.store';
import { HallReservationsRoutingModule } from './hall-reservations-routing.module';
import { HallReservationListComponent } from './pages/hall-reservation-list/hall-reservation-list.component';

@NgModule({
  declarations: [HallReservationListComponent],
  imports: [
    CommonModule,
    HallReservationsRoutingModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule
  ],
  providers: [HallReservationsFacade, HallReservationsStore]
})
export class HallReservationsModule {}
