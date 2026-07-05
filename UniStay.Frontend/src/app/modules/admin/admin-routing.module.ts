import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminHallModule } from './admin-hall/admin-hall.module';
import { HallListComponent } from '../shared/hall/hall-list/hall-list.component';
import { HallAddComponent } from '../shared/hall/hall-add/hall-add.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'hall', loadChildren: () => import('../shared/hall/hall.module').then(m => m.HallModule) },
      { path: 'rooms', loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsModule) },
      //{ path: '', redirectTo: 'hall/list', pathMatch: 'full' },
      { path: 'fault', loadChildren: () => import('../shared/fault/fault.module').then(m => m.FaultModule) },
      //{ path: '', redirectTo: 'fault/list', pathMatch: 'full' }
      { path: 'equipment', loadChildren: () => import('../shared/equipment/equipment.module').then(m => m.EquipmentModule) },
            { path:'chat',loadChildren:()=>import('../shared/chat/chat-module').then(m=>m.ChatModule)},
      { path: 'invites', loadChildren: () => import('./invites/invites.module').then(m => m.InvitesModule) },
      { path: 'payments', loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule) },
      { path: 'announcements', loadChildren: () => import('./announcements/announcements.module').then(m => m.AnnouncementsModule) },
      { path: 'bed-assignments', loadChildren: () => import('./bed-assignments/bed-assignments.module').then(m => m.BedAssignmentsModule) },
      { path: 'hall-reservations', loadChildren: () => import('./hall-reservations/hall-reservations.module').then(m => m.HallReservationsModule) },
      { path: 'webhooks', loadChildren: () => import('./webhooks/webhooks.module').then(m => m.WebhooksModule) },
      { path: 'applications', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) },
      { path: 'users', loadChildren: () => import('./admin-user/admin-user.module').then(m => m.AdminUserModule) },
      { path: 'security-questions', redirectTo: 'security-questions/security-questions-add', pathMatch: 'full' },
      { path: 'security-questions', loadChildren: () => import('../shared/set-security/set-security.module').then(m => m.SecurityQuestionsModule) },
      { path: 'settings', loadChildren: () => import('../shared/settings/settings.module').then(m => m.SettingsModule) },
      { path: 'profile', redirectTo: 'settings', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
