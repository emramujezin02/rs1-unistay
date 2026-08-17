import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HallModule } from './hall/hall.module';
import { FaultModule } from './fault/fault.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './pages/landing/landing.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule} from './shared-routing.module';
import { AnimateOnScrollDirective } from './directives/animate-on-scroll.directive';
import { AboutComponent } from './pages/about/about.component';
import { FeaturesComponent } from './pages/features/features.component';
import { StaffComponent } from './pages/staff/staff.component';
import { MealPlanComponent } from './pages/meal-plan/meal-plan.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { EquipmentModule } from './equipment/equipment.module';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { TwoFactorModule } from './two-factor/two-factor.module';
import { AnalyticsModule } from './analytics/analytics-module';
import { MaterialModule } from './material/material';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RoomModule } from './room/room.module';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FavoriteModule } from './favorite/favorite.module';
import { SecurityQuestionsModule } from './set-security/set-security.module';
import { AnnouncementCarouselComponent } from './components/announcement-carousel/announcement-carousel.component';
import { AnnouncementDetailDialogComponent } from './components/announcement-detail-dialog/announcement-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { BamCurrencyPipe } from './pipes/bam-currency.pipe';
import { PaymentStatusColorPipe } from './pipes/payment-status-color.pipe';
import { FaultStatusColorPipe } from './pipes/fault-status-color.pipe';
import { FaultPriorityColorPipe } from './pipes/fault-priority-color.pipe';
import { AppStatusColorPipe } from './pipes/app-status-color.pipe';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LandingPageComponent,
    AnimateOnScrollDirective,
    AboutComponent,
    FeaturesComponent,
    StaffComponent,
    MealPlanComponent,
    AboutComponent,
    UserAddComponent,
    PasswordRecoveryComponent,
    AutocompleteComponent,
    AnnouncementCarouselComponent,
    AnnouncementDetailDialogComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    NotificationBellComponent,
    BamCurrencyPipe,
    PaymentStatusColorPipe,
    FaultStatusColorPipe,
    FaultPriorityColorPipe,
    AppStatusColorPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedRoutingModule,
    FormsModule,//,
    //ChatModule

        MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatAutocompleteModule,
    SecurityQuestionsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HallModule,
    FaultModule,
    HeaderComponent,
    AboutComponent,
    FooterComponent,
    FeaturesComponent,
    StaffComponent,
    MealPlanComponent,
    UserAddComponent,
    PasswordRecoveryComponent,
    EquipmentModule,
    TwoFactorModule,
    AnalyticsModule,
    MaterialModule,
    RoomModule,
    FavoriteModule,
    SecurityQuestionsModule,
    AnnouncementCarouselComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    NotificationBellComponent,
    BamCurrencyPipe,
    PaymentStatusColorPipe,
    FaultStatusColorPipe,
    FaultPriorityColorPipe,
    AppStatusColorPipe

    //ChatModule
   // SetSecurityQuestionsComponent
  ]
})
export class SharedModule {}
