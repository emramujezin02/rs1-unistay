import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FavoritesComponent } from './favorite-list/favorite.component';
import { FavoriteRoutingModule } from './favorite-routing.module';
@NgModule({
  declarations: [
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FavoriteRoutingModule,
    MaterialModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatSortModule,
    MatOptionModule,
    MatInputModule,
    MaterialModule
],
  exports: [
    FavoritesComponent]
})
export class FavoriteModule {}
