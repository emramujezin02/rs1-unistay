import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TwoFactorVerifyComponent } from './two-factor-verify/two-factor-verify.component';
import { TwoFactorSettingsComponent } from './two-factor-settings/two-factor-settings.component';

const routes: Routes = [
 // { path: '', redirectTo: 'two-factor-verify', pathMatch: 'full' },
  { path: 'two-factor-settings', component: TwoFactorSettingsComponent },
  { path: 'two-factor-verify', component: TwoFactorVerifyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwoFactorRoutingModule {}