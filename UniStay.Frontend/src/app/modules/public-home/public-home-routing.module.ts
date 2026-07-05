import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomePageComponent } from './pages/home/public-home-page.component';

const routes: Routes = [
  { path: '', component: PublicHomePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicHomeRoutingModule {}
