import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorite-list/favorite.component';

const routes: Routes = [
  { path: '', redirectTo: 'favorite-list', pathMatch: 'full' },
  { path: 'favorite-list', component: FavoritesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoriteRoutingModule {}