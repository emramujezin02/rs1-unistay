import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteListComponent } from './pages/invite-list/invite-list.component';

const routes: Routes = [
  { path: '', component: InviteListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitesRoutingModule {}
