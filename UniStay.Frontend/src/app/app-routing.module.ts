import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { LogoutComponent } from './modules/auth/logout/logout.component';
import { RoomDetailsComponent } from './modules/shared/room/room-details/room-details.component';
import { RoomListComponent } from './modules/shared/room/room-list/room-list.component';
import { PasswordRecoveryComponent } from './modules/shared/password-recovery/password-recovery.component';
import { SecurityQuestionsAddComponent } from './modules/shared/set-security/security-questions-add/security-questions-add.component';
import { SecurityQuestionsAnswerComponent } from './modules/shared/set-security/security-questions-answer/security-questions-answer.component';
import { RoleGuard } from './auth-guards/role-guard.service';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'auth',
    children: [
      { path: 'login', redirectTo: '/login', pathMatch: 'full' },
      { path: 'register', redirectTo: '/register', pathMatch: 'full' },
      { path: 'logout', redirectTo: '/logout', pathMatch: 'full' },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  },
  {
    path:'two-factor',
    loadChildren:()=>
      import('./modules/shared/two-factor/two-factor.module')
      .then(m=>m.TwoFactorModule)
  },
  {
    path:'chat',
    loadChildren:()=>
      import('./modules/shared/chat/chat-module').then(m=>m.ChatModule)
  },

  {
    path:'analytics',
    loadChildren:()=>
      import('./modules/shared/analytics/analytics-module').then(m=>m.AnalyticsModule)
  },
  {
    path: 'equipment-items-create/:id',
    redirectTo: 'admin/equipment/equipment-items-create/:id'
  },

  { path: 'room-list', component: RoomListComponent },
  { path: 'room-details/:id', component: RoomDetailsComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: 'security-questions', redirectTo: 'security-questions/security-questions-add', pathMatch: 'full' },
  { path: 'security-questions/security-questions-add', component: SecurityQuestionsAddComponent },
  { path: 'security-questions/security-questions-answer', component: SecurityQuestionsAnswerComponent },
  { path: 'security-questions/security-querstions-answer', redirectTo: 'security-questions/security-questions-answer', pathMatch: 'full' },

  {
    path: 'rooms',
    loadChildren: () =>
      import('./modules/public/public.module').then(m => m.PublicModule)
  },

  {
    path: 'public',
    loadChildren: () =>
      import('./modules/public/public.module').then(m => m.PublicModule)
  },

  {
    path: 'public-home',
    loadChildren: () =>
      import('./modules/public-home/public-home.module').then(m => m.PublicHomeModule)
  },

  {
    path: 'public-layout',
    loadChildren: () =>
      import('./modules/public-layout/public-layout.module').then(m => m.PublicLayoutModule)
  },

  {
    path:'',
    pathMatch:'full',
    loadChildren:()=>
      import('./modules/shared/shared.module').then(m=>m.SharedModule)
  },

  {
    path: 'student',
    canActivate: [RoleGuard],
    data: { roles: ['student'] },
    loadChildren: () => import('./modules/student/student-module').then(m => m.StudentModule)
  },
  {
    path: 'employee',
    canActivate: [RoleGuard],
    data: { roles: ['employee'] },
    loadChildren: () => import('./modules/employee/employee-module').then(m => m.EmployeeModule)
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
