// src/app/modules/employee/employee-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeRoomsComponent } from './employee-rooms/employee-rooms.component';
import { EmployeeStudentsComponent } from './employee-students/employee-students.component';
import { InviteFriendComponent } from '../shared/invite-friend/invite-friend.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDashboardComponent,
    children: [
      { path: 'hall', loadChildren: () => import('../shared/hall/hall.module').then(m => m.HallModule) },
      //{ path: '', redirectTo: 'hall/list', pathMatch: 'full' },
      { path: 'invite-friend', component: InviteFriendComponent },
      { path: 'rooms', component: EmployeeRoomsComponent },
      { path: 'students', component: EmployeeStudentsComponent },
      { path: 'hall-reservations', loadChildren: () => import('../admin/hall-reservations/hall-reservations.module').then(m => m.HallReservationsModule) },
      { path: 'fault', loadChildren: () => import('../shared/fault/fault.module').then(m => m.FaultModule) },
      //{ path: '', redirectTo: 'fault/list', pathMatch: 'full' }
      { path: 'equipment', loadChildren: () => import('../shared/equipment/equipment.module').then(m => m.EquipmentModule) },
      { path:'chat',loadChildren:()=>import('../shared/chat/chat-module').then(m=>m.ChatModule)},
      { path: 'security-questions', redirectTo: 'security-questions/security-questions-add', pathMatch: 'full' },
      {
        path: 'security-questions',
        loadChildren: () => import('../shared/set-security/set-security.module').then(m => m.SecurityQuestionsModule)
      },
      { path: 'settings', loadChildren: () => import('../shared/settings/settings.module').then(m => m.SettingsModule) },
      { path: 'profile', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'employee-dashboard', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {}
