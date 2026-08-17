import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ApplicationRef } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from './modules/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthModule } from './modules/auth/auth-module';
import { StudentModule } from './modules/student/student-module';
import { AdminModule } from './modules/admin/admin-module';
import { EmployeeModule } from './modules/employee/employee-module';
import { RouterModule } from '@angular/router';
import { NgModel } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';

//import { InvoicesComponent } from './modules/student/pages/invoices/invoices.component';


//import { UserAddComponent } from './modules/shared/user/user-add/user-add.component';

@NgModule({
  declarations: [
    AppComponent,

    //UserAddComponent
  ],
  imports: [
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
   // StudentModule,
   // EmployeeModule,
   // AdminModule,
    RouterModule
  ],
  providers: [
{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }


  ],
  bootstrap:[ AppComponent ]
})
export class AppModule {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
  }
}
