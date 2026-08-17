import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { BedAssignmentsRoutingModule } from './bed-assignments-routing.module';
import { BedAssignmentsFacade } from './data/bed-assignments.facade';
import { BedAssignmentsStore } from './data/bed-assignments.store';
import { AssignBedDialogComponent } from './dialogs/assign-bed-dialog/assign-bed-dialog.component';
import { BedAssignmentListComponent } from './pages/bed-assignment-list/bed-assignment-list.component';

@NgModule({
  declarations: [
    BedAssignmentListComponent,
    AssignBedDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BedAssignmentsRoutingModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule
  ],
  providers: [
    BedAssignmentsFacade,
    BedAssignmentsStore
  ]
})
export class BedAssignmentsModule {}
