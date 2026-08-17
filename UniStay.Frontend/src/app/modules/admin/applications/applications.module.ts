import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
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
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsFacade } from './data/applications.facade';
import { ApplicationsStore } from './data/applications.store';
import { ApplicationDetailDialogComponent } from './dialogs/application-detail-dialog/application-detail-dialog.component';
import { ApproveApplicationDialogComponent } from './dialogs/approve-application-dialog/approve-application-dialog.component';
import { ApplicationListComponent } from './pages/application-list/application-list.component';

@NgModule({
  declarations: [
    ApplicationListComponent,
    ApproveApplicationDialogComponent,
    ApplicationDetailDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApplicationsRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
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
    ApplicationsFacade,
    ApplicationsStore
  ]
})
export class ApplicationsModule {}
