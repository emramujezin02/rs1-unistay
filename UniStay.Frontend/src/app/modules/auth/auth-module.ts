import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { MyReactiveFormsModule } from '../shared/my-reactive-forms/my-reactive-forms.module';
import { AdminHallModule } from '../admin/admin-hall/admin-hall.module';
import { EmployeeModule } from '../employee/employee-module';
import { PasswordRecoveryComponent } from '../shared/password-recovery/password-recovery.component';
import { ChatModule } from '../shared/chat/chat-module';
import { AnalyticsModule } from '../shared/analytics/analytics-module';
import { MaterialModule } from '../shared/material/material';
import { AutocompleteComponent } from '../shared/autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    RouterModule,
    MyReactiveFormsModule,
    MaterialModule,
    MatAutocompleteModule,
    NgxCaptchaModule
  ]
})
export class AuthModule {}
