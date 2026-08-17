import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material';

//import { UserRoutingModule } from './user-routing.module';

//import { UserListComponent } from './user-list/user-list.component';
//import { UserAddComponent } from './user-add/user-add.component';
//import { UserUpdateComponent } from './user-update/user-update.component';

@NgModule({
  declarations: [
   // UserListComponent,
   // UserAddComponent,
    //UserUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
   // UserRoutingModule
  ]
})
export class UserModule {}
