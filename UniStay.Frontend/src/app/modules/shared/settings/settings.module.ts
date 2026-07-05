import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material';
import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';

@NgModule({
  declarations: [
    ProfileSettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {}
