import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TwoFactorSettingsComponent } from './two-factor-settings/two-factor-settings.component';
import { TwoFactorVerifyComponent } from './two-factor-verify/two-factor-verify.component';
import { TwoFactorRoutingModule } from './two-factor-routing.module';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MaterialModule } from '../material/material';


@NgModule({
  declarations: [
    TwoFactorSettingsComponent,
    TwoFactorVerifyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TwoFactorRoutingModule,
    MaterialModule
  ],
  exports: [
    TwoFactorSettingsComponent,
    TwoFactorVerifyComponent
  ]
})
export class TwoFactorModule {}