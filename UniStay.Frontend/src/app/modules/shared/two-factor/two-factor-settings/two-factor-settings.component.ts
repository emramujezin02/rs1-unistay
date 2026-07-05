import { Component, OnInit } from '@angular/core';
import { TwoFactorService } from '../../../../endpoints/auth-endpoints/two-factor-endpoint.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor-settings',
  templateUrl: './two-factor-settings.component.html',
  standalone:false
})
export class TwoFactorSettingsComponent implements OnInit {
  userId = Number(localStorage.getItem('id')) || 0;
  enabled = false;
  backupCodes: string[] = [];

  constructor(private svc: TwoFactorService) {}

  ngOnInit() {
    // optionally call backend to get current status
  }

  enable() {
    this.svc.enable(this.userId).subscribe({
      next: (res:any) => {
        this.enabled = true;
        this.backupCodes = res?.backupCodes || [];
        alert('2FA enabled. Save backup codes.');
      },
      error: () => alert('Error enabling')
    });
  }

  disable() {
    if(!confirm('Disable 2FA?')) return;
    this.svc.disable(this.userId).subscribe({
      next: () => { this.enabled = false; this.backupCodes = []; alert('2FA disabled'); },
      error: () => alert('Error disabling')
    });
  }

  sendTestCode() {
    this.svc.sendCode(this.userId).subscribe({
      next: ()=> alert('Code sent to your email'),
      error: ()=> alert('Error sending code')
    });
  }
}