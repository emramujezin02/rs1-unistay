import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HallListComponent } from './hall-list/hall-list.component';
import { HallAddComponent } from './hall-add/hall-add.component';
import { HallRoutingModule } from './hall-routing.module';
import { MaterialModule } from '../material/material';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HallListComponent,
    HallAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HallRoutingModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatOptionModule,
    MatInputModule,
    MatSortModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [
    HallListComponent,
    HallAddComponent
  ]
})
export class HallModule {}
