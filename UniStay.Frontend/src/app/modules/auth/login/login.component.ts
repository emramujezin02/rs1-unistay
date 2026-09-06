import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { Router } from '@angular/router';
import { MyInputTextType } from '../../shared/my-reactive-forms/my-input-text/my-input-text.component';
import { UserGetByIdEndpointService } from '../../../endpoints/user-endpoints/user-get-by-id-endpoint.service';
import { ThemeService } from '../../../services/theme-service/theme.service';
import { MyConfig } from '../../../my-config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  emails: string[] = [];
  filteredEmails: string[] = [];
  showSuggestions = false;

  form: FormGroup;
  protected readonly MyInputTextType = MyInputTextType;
  protected readonly recaptchaSiteKey = MyConfig.recaptchaSiteKey;

  constructor(
    private fb: FormBuilder,
    private authService: MyAuthService,
    private router: Router,
    private zone: NgZone,
    private userGetByIdEndpoint: UserGetByIdEndpointService,
    private themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
      captchaToken: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const users = this.authService.getRememberedUsers();
    this.emails = users.map(x => x.email);

    this.form.get('email')?.valueChanges.subscribe(value => {
      const val = (value || '').toLowerCase();

      if (!val) {
        this.filteredEmails = [];
        this.showSuggestions = false;
        return;
      }

      this.showSuggestions = true;

      this.filteredEmails = this.emails.filter(e =>
        e.toLowerCase().includes(val)
      );
    });
  }

  passwordRecovery() {
    this.router.navigate(['/password-recovery']);
  }

  onEmailSelected(email: string) {
    this.form.patchValue({
      email,
      password: '',
      rememberMe:true
    });

    this.showSuggestions = false;
  }

  onLogin(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe, captchaToken } = this.form.value;
    const fingerprint = this.getDeviceFingerprint();

    this.authService.login(email, password, rememberMe, fingerprint, captchaToken).subscribe({
      next: (response) => {

        const requiresTwoFactor = response.requiresTwoFactor ?? response.RequiresTwoFactor;
        if (requiresTwoFactor) {
          const twoFactorChallengeId = response.twoFactorChallengeId ?? response.TwoFactorChallengeId;
          const twoFactorEmail = response.email ?? response.Email ?? email;

          if (!twoFactorChallengeId) {
            this.snackBar.open('Two-factor login challenge was not issued.', 'OK', { duration: 3000 });
            return;
          }

          sessionStorage.setItem('rememberMe', rememberMe.toString());
          sessionStorage.setItem('2fa_fingerprint', fingerprint);
          if (rememberMe) {
            const users = this.authService.rememberEmail(email);

            this.emails = users.map(x => x.email);
            this.filteredEmails = this.emails;

          }

          sessionStorage.setItem('2fa_challengeId', twoFactorChallengeId.toString());
          sessionStorage.setItem('2fa_email', twoFactorEmail);

          this.router.navigate(['/two-factor/two-factor-verify'], {
            queryParams: { email: twoFactorEmail }
          });

          return;
        }

        if (rememberMe) {
          const users = this.authService.rememberEmail(email);

          this.emails = users.map(x => x.email);
          this.filteredEmails = this.emails;

        }

        if (response.theme === 'light' || response.theme === 'dark') {
          this.themeService.setTheme(response.theme);
        }

        const authInfo = response.myAuthInfo;
        const token = response.token ?? response.accessToken;
        const roleName = this.authService.normalizeRole(authInfo?.roleName ?? response.roleName);

        this.authService.saveTokenPair(token, response.refreshToken);
        localStorage.setItem('id', response.userId.toString());
        localStorage.setItem('email', response.email ?? email);

        this.authService.setSession(token, roleName ?? '');
        if (roleName) {
          localStorage.setItem('role', roleName);
        }

        this.userGetByIdEndpoint.getById(response.userId)
          .subscribe(user => {
            this.authService.setUser(user);
          });

        this.router.navigate([this.authService.getDashboardRouteForRole(roleName)]);
      }
    });
  }

  onEmailFocus() {
    this.showSuggestions = true;
    this.filteredEmails = [...this.emails];
  }

  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  private getDeviceFingerprint(): string {
    const storageKey = 'deviceFingerprint';
    let fingerprint = localStorage.getItem(storageKey);

    if (!fingerprint) {
      fingerprint = crypto.randomUUID();
      localStorage.setItem(storageKey, fingerprint);
    }

    return fingerprint;
  }
}
