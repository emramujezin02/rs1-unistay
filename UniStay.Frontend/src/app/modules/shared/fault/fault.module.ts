import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaultListComponent } from './fault-list/fault-list.component';
import { FaultAddComponent } from './fault-add/fault-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaultRoutingModule } from './fault-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
  declarations: [
    FaultListComponent,
    FaultAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FaultRoutingModule,
    MaterialModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatSortModule,
    MatOptionModule,
    MatInputModule,
    MaterialModule
],
  exports: [
    FaultListComponent, 
    FaultAddComponent]
})
export class FaultModule {}
