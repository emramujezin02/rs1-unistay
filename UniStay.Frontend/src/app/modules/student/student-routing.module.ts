import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import {InvoicesComponent} from './pages/invoices/invoices.component';
import {AuthGuard} from '../../auth-guards/auth-guard.service';
import { StudentDashboardHomeComponent } from './student-dashboard-home/student-dashboard-home.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { InviteFriendComponent } from '../shared/invite-friend/invite-friend.component';


// const routes: Routes = [
// {path:' ',component:StudentDashboardComponent},
// {path:'student-dashboard',component:StudentDashboardComponent},
// { path:'chat',loadChildren:()=>import('../shared/chat/chat-module').then(m=>m.ChatModule)},
// ];
const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    //canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardHomeComponent },
      { path: 'invite-friend', component: InviteFriendComponent },
      { path: 'apply', component: ApplyComponent },
      {
        path: 'rooms',
        loadChildren: () => import('../shared/room/room.module').then(m => m.RoomModule)
      },
      { path: 'room-details/:id', redirectTo: 'rooms/room-details/:id', pathMatch: 'full' },
      {
        path: 'favorites',
        loadChildren: () => import('../shared/favorite/favorite.module').then(m => m.FavoriteModule)
      },
      { path: 'security-questions', redirectTo: 'security-questions/security-questions-add', pathMatch: 'full' },
      {
        path: 'security-questions',
        loadChildren: () => import('../shared/set-security/set-security.module').then(m => m.SecurityQuestionsModule)
      },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'payments', redirectTo: 'invoices', pathMatch: 'full' },
      { path:'chat',loadChildren:()=>import('../shared/chat/chat-module').then(m=>m.ChatModule)},
      { path: 'messages', redirectTo: 'chat', pathMatch: 'full' },
      { path: 'profile', loadChildren: () => import('../shared/settings/settings.module').then(m => m.SettingsModule) },
      { path: 'settings', loadChildren: () => import('../shared/settings/settings.module').then(m => m.SettingsModule) },
      //{ path: 'payments', component: PaymentsComponent },
      //{ path: 'profile', component: ProfileComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
