import { Component } from '@angular/core';
import { TwoFactorService } from '../../../../endpoints/auth-endpoints/two-factor-endpoint.service';
import { Router } from '@angular/router';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-two-factor-verify',
  templateUrl: './two-factor-verify.component.html',
  standalone:false
})
export class TwoFactorVerifyComponent {
  userId = 0; // set from login response (or route query)
  code = '';
  rememberMe = false;
  fingerprint = '';

  constructor(private svc: TwoFactorService, private router: Router, private auth: MyAuthService) {
    const t = sessionStorage.getItem('2fa_userId');
    this.userId = t ? +t : 0;
    this.rememberMe = sessionStorage.getItem('rememberMe') === 'true';
    this.fingerprint = sessionStorage.getItem('2fa_fingerprint') ?? '';
  }

  verify() {
  this.svc.verify(this.userId, this.code, this.rememberMe, this.fingerprint).subscribe({
    next: (res: any) => {

      const token = res.token ?? res.accessToken;
      const roleName = this.auth.normalizeRole(res.myAuthInfo?.roleName ?? res.roleName);

      // ✅ OVO TI FALI (KLJUČNO)
      const email = sessionStorage.getItem('2fa_email');
      const rememberMe = this.rememberMe; // ili prenesi ako želiš realno stanje

      if (rememberMe && email) {
        const savedEmails = JSON.parse(localStorage.getItem('rememberedEmails') || '[]');

        if (!savedEmails.includes(email)) {
          savedEmails.push(email);
          localStorage.setItem('rememberedEmails', JSON.stringify(savedEmails));
        }

        console.log("✅ SAVED EMAIL FROM 2FA:", savedEmails);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('roleName', roleName ?? '');
      localStorage.setItem('id', (res.userId ?? this.userId).toString());
      localStorage.setItem('email', res.email ?? email ?? '');
      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }
      

      this.auth.setSession(token, roleName ?? '');

      sessionStorage.removeItem('2fa_userId');
      sessionStorage.removeItem('2fa_email');
      sessionStorage.removeItem('2fa_fingerprint');
      sessionStorage.removeItem('rememberMe');

      this.router.navigate([this.auth.getDashboardRouteForRole(roleName)]);
    },
    error: () => alert("Invalid or expired code")
  });
}
  resend() {
    this.svc.sendCode(this.userId).subscribe(() => alert('Code sent'));
  }
}
