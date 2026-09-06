import { Component } from '@angular/core';
import { TwoFactorService } from '../../../../endpoints/auth-endpoints/two-factor-endpoint.service';
import { Router } from '@angular/router';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { ThemeService } from '../../../../services/theme-service/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-two-factor-verify',
  templateUrl: './two-factor-verify.component.html',
  standalone:false
})
export class TwoFactorVerifyComponent {
  challengeId = ''; 
  code = '';
  form: FormGroup;
  rememberMe = false;
  fingerprint = '';

  constructor(private svc: TwoFactorService, private router: Router, private auth: MyAuthService, private themeService: ThemeService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]]
    });

    this.challengeId = sessionStorage.getItem('2fa_challengeId') ?? '';
    this.rememberMe = sessionStorage.getItem('rememberMe') === 'true';
    this.fingerprint = sessionStorage.getItem('2fa_fingerprint') ?? '';
  }

  verify() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.code = this.form.value.code;

  this.svc.verify(this.challengeId, this.code, this.rememberMe, this.fingerprint).subscribe({
    next: (res) => {

      const token = res.token ?? res.accessToken;
      const roleName = this.auth.normalizeRole(res.myAuthInfo?.roleName ?? res.roleName);

      const email = sessionStorage.getItem('2fa_email');
      const rememberMe = this.rememberMe; 

      if (rememberMe && email) {
        this.auth.rememberEmail(email);
      }

      this.auth.saveTokenPair(token, res.refreshToken);
      localStorage.setItem('roleName', roleName ?? '');
      localStorage.setItem('id', res.userId.toString());
      localStorage.setItem('email', res.email ?? email ?? '');
      if (res.theme === 'light' || res.theme === 'dark') {
        this.themeService.setTheme(res.theme);
      }

      this.auth.setSession(token, roleName ?? '');

      sessionStorage.removeItem('2fa_challengeId');
      sessionStorage.removeItem('2fa_email');
      sessionStorage.removeItem('2fa_fingerprint');
      sessionStorage.removeItem('rememberMe');

      this.router.navigate([this.auth.getDashboardRouteForRole(roleName)]);
    },
    error: () => this.snackBar.open('Invalid or expired code', 'OK', { duration: 3000 })
  });
}
  resend() {
    this.svc.sendCode(this.challengeId).subscribe(() => {
      this.snackBar.open('Code sent', 'OK', { duration: 3000 });
    });
  }
}

