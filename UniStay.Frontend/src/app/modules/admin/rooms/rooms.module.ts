import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { RoomsFacade } from './data/rooms.facade';
import { RoomsStore } from './data/rooms.store';
import { RoomFormComponent } from './pages/room-form/room-form.component';
import { RoomListComponent } from './pages/room-list/room-list.component';
import { RoomsRoutingModule } from './rooms-routing.module';

@NgModule({
  declarations: [
    RoomListComponent,
    RoomFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RoomsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
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
  providers: [
    RoomsFacade,
    RoomsStore
  ]
})
export class RoomsModule {}
