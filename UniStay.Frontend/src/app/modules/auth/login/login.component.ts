import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { Router } from '@angular/router';
import { MyInputTextType } from '../../shared/my-reactive-forms/my-input-text/my-input-text.component';
import { UserGetByIdEndpointService } from '../../../endpoints/user-endpoints/user-get-by-id-endpoint.service';
import { ThemeService } from '../../../services/theme-service/theme.service';
import { MyConfig } from '../../../my-config';

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
    private themeService: ThemeService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
      captchaToken: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 🔥 UČITAJ emailove iz saved users (email + password)
    const users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');
    this.emails = users.map((x: any) => x.email);

    this.form.get('email')?.valueChanges.subscribe(value => {
      const val = (value || '').toLowerCase();

      console.log("INPUT:", val);
      console.log("ALL EMAILS:", this.emails);

      if (!val) {
        this.filteredEmails = [];
        this.showSuggestions = false;
        return;
      }

      this.showSuggestions = true;

      this.filteredEmails = this.emails.filter(e =>
        e.toLowerCase().includes(val)
      );

      console.log("FILTERED:", this.filteredEmails);
    });
  }

  passwordRecovery() {
    this.router.navigate(['/password-recovery']);
  }

  // 🔥 KLJUČNO — POPUNI I PASSWORD
  onEmailSelected(email: string) {
    const users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');

    const user = users.find((x: any) => x.email === email);

    if (user) {
      this.form.patchValue({
        email: user.email,
        password: user.password,
        rememberMe:true
      });
    }

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

        // ⭐⭐⭐ 2FA ⭐⭐⭐
        const requiresTwoFactor = response.requiresTwoFactor ?? response.RequiresTwoFactor;
        if (requiresTwoFactor) {
          const twoFactorUserId = response.twoFactorUserId ?? response.TwoFactorUserId ?? response.userId ?? response.UserId;
          const twoFactorEmail = response.email ?? response.Email ?? email;

          sessionStorage.setItem('rememberMe', rememberMe.toString());
          sessionStorage.setItem('2fa_fingerprint', fingerprint);
          if (rememberMe) {
            let users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');

            const exists = users.find((x: any) => x.email === email);

            if (!exists) {
              users.push({ email, password });
              localStorage.setItem('rememberedUsers', JSON.stringify(users));
            }

            this.emails = users.map((x: any) => x.email);
            this.filteredEmails = this.emails;

            console.log("✅ SAVED USERS:", users);
          }

          sessionStorage.setItem('2fa_userId', twoFactorUserId.toString());
          sessionStorage.setItem('2fa_email', twoFactorEmail);

          this.router.navigate(['/two-factor/two-factor-verify'], {
            queryParams: { email: twoFactorEmail }
          });

          return;
        }

        // ⭐⭐⭐ NORMAL LOGIN ⭐⭐⭐

        if (rememberMe) {
          let users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');

          const exists = users.find((x: any) => x.email === email);

          if (!exists) {
            users.push({ email, password });
            localStorage.setItem('rememberedUsers', JSON.stringify(users));
          }

          this.emails = users.map((x: any) => x.email);
          this.filteredEmails = this.emails;

          console.log("✅ SAVED USERS:", users);
        }

        if (response.theme) {
          this.themeService.setTheme(response.theme);
        }

        const authInfo = response.myAuthInfo;
        const token = response.token ?? response.accessToken;
        const roleName = this.authService.normalizeRole(authInfo?.roleName ?? response.roleName);

        localStorage.setItem('token', token);
        localStorage.setItem('id', response.userId.toString());
        localStorage.setItem('email', response.email ?? email);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

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
    console.log("🔥 EMAIL FOCUS OK");
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
