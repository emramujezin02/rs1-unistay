import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentAddComponent } from './equipment-add/equipment-add.component';
import { EquipmentRoutingModule } from './equipment-routing.module';
import { EquipmentItemsListComponent } from './equipment-items-list/equipment-items-list.component';
import { EquipmentItemCreateComponent } from './equipment-items-create/equipment-items-create.component';
import { EquipmentItemUpdateComponent } from './equipment-items-update/equipment-items-update.component';
import { MaterialModule } from '../material/material';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EquipmentListComponent,
    EquipmentAddComponent,
    EquipmentItemsListComponent,
    EquipmentItemCreateComponent,
    EquipmentItemUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EquipmentRoutingModule,
    MaterialModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatSortModule,
    MatOptionModule,
    MatInputModule,
    TranslateModule,
    MaterialModule
],
  exports: [
    EquipmentListComponent,
    EquipmentAddComponent,
    EquipmentItemsListComponent,
    EquipmentItemCreateComponent,
    EquipmentItemUpdateComponent
  ]
})
export class EquipmentModule {}
