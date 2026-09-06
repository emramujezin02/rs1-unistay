import { Component, OnInit } from '@angular/core';
import { TwoFactorService } from '../../../../endpoints/auth-endpoints/two-factor-endpoint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-two-factor-settings',
  templateUrl: './two-factor-settings.component.html',
  standalone:false
})
export class TwoFactorSettingsComponent implements OnInit {
  enabled = false;
  backupCodes: string[] = [];

  constructor(
    private svc: TwoFactorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // optionally call backend to get current status
  }

  enable() {
    this.svc.enable().subscribe({
      next: (res) => {
        this.enabled = true;
        this.backupCodes = res?.backupCodes || [];
        this.snackBar.open('2FA enabled. Save backup codes.', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error enabling', 'OK', { duration: 3000 })
    });
  }

  disable() {
    this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Disable 2FA?' }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.svc.disable().subscribe({
        next: () => {
          this.enabled = false;
          this.backupCodes = [];
          this.snackBar.open('2FA disabled', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error disabling', 'OK', { duration: 3000 })
      });
    });
  }

  sendTestCode() {
    this.svc.sendCode().subscribe({
      next: ()=> this.snackBar.open('Code sent to your email', 'OK', { duration: 3000 }),
      error: ()=> this.snackBar.open('Error sending code', 'OK', { duration: 3000 })
    });
  }
}
