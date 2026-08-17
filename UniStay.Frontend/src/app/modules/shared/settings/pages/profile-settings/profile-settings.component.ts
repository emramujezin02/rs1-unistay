import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppLanguage, LanguageService } from '../../../../../core/i18n/language.service';
import { MyAuthService } from '../../../../../services/auth-services/my-auth.service';
import { ProfileSettingsEndpointService } from '../../../../../endpoints/profile-settings-endpoints/profile-settings-endpoint.service';
import { ProfileSettingsDto } from '../../../../../endpoints/profile-settings-endpoints/profile-settings.models';

interface SettingsPanelItem {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  standalone: false
})
export class ProfileSettingsComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  profileLoading = false;
  profileSaving = false;
  passwordSaving = false;
  profileSuccess = '';
  profileError = '';
  passwordSuccess = '';
  passwordError = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  readonly panelNavItems: SettingsPanelItem[] = [
    { title: 'Dashboard', icon: 'dashboard', route: '/employee' },
    { title: 'Hall list', icon: 'business', route: '/employee/hall/hall-list' },
    { title: 'Faults', icon: 'build', route: '/employee/fault/fault-list' },
    { title: 'Equipment', icon: 'inventory_2', route: '/employee/equipment/equipment-list' },
    { title: 'Chat', icon: 'chat_bubble_outline', route: '/employee/chat' },
    { title: 'Settings', icon: 'tune', route: '/employee/settings' }
  ];

  readonly languages: { code: AppLanguage; label: string; labelKey: string }[] = [
    { code: 'bs', label: 'BS', labelKey: 'SETTINGS.LANGUAGE_BS' },
    { code: 'en', label: 'EN', labelKey: 'SETTINGS.LANGUAGE_EN' }
  ];

  constructor(
    private fb: FormBuilder,
    private profileEndpoint: ProfileSettingsEndpointService,
    private authService: MyAuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      phone: ['', [Validators.pattern(/^\d{6,15}$/)]],
      dateOfBirth: [null],
      profileImage: ['', [Validators.maxLength(500)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });

    this.loadProfile();
  }

  loadProfile(): void {
    this.profileLoading = true;
    this.profileError = '';

    this.profileEndpoint.getCurrentProfile().subscribe({
      next: profile => {
        this.patchProfile(profile, false);
        this.authService.setUser(profile);
        this.profileLoading = false;
      },
      error: () => {
        this.profileError = this.settingsText('SETTINGS.PROFILE_LOAD_ERROR', 'Profile could not be loaded. Please try again.');
        this.profileLoading = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileSaving = true;
    this.profileError = '';
    this.profileSuccess = '';

    const value = this.profileForm.value;
    this.profileEndpoint.updateCurrentProfile({
      firstName: value.firstName,
      lastName: value.lastName,
      username: value.username,
      email: value.email,
      phone: value.phone ?? '',
      dateOfBirth: value.dateOfBirth || null,
      profileImage: value.profileImage ?? ''
    }).subscribe({
      next: profile => {
        this.patchProfile(profile, false);
        this.authService.setUser(profile);
        localStorage.setItem('email', profile.email);
        this.profileSaving = false;
        this.profileSuccess = this.settingsText('SETTINGS.PROFILE_SAVED', 'Profile updated successfully.');
        this.snackBar.open(this.profileSuccess, this.settingsText('SETTINGS.CLOSE', 'Close'), { duration: 3000 });
      },
      error: err => {
        this.profileSaving = false;
        this.profileError = this.errorMessage(err, this.settingsText('SETTINGS.PROFILE_SAVE_ERROR', 'Failed to save profile. Please try again.'));
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordSaving = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    const value = this.passwordForm.value;
    this.profileEndpoint.changePassword({
      currentPassword: value.currentPassword,
      newPassword: value.newPassword
    }).subscribe({
      next: response => {
        this.passwordSaving = false;
        this.passwordSuccess = response?.message || this.settingsText('SETTINGS.PASSWORD_SAVED', 'Password changed successfully.');
        this.passwordForm.reset();
        this.snackBar.open(this.passwordSuccess, this.settingsText('SETTINGS.CLOSE', 'Close'), { duration: 3000 });
      },
      error: err => {
        this.passwordSaving = false;
        this.passwordError = this.errorMessage(err, this.settingsText('SETTINGS.PASSWORD_SAVE_ERROR', 'Failed to change password. Please check your current password.'));
      }
    });
  }

  isInvalid(controlName: string, form: FormGroup = this.profileForm): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url.split('?')[0].split('#')[0].replace(/\/$/, '');
    if (route === '/employee') {
      return currentUrl === '/employee' || currentUrl === '/employee/employee-dashboard';
    }

    return currentUrl === route || currentUrl.startsWith(route + '/');
  }

  get showEmployeePanel(): boolean {
    return this.router.url.split('?')[0].split('#')[0].startsWith('/employee');
  }

  /*get showAdminLanguageSelector(): boolean {
    return this.router.url.split('?')[0].split('#')[0].startsWith('/admin');
  }*/

    get showLanguageSelector(): boolean {
  return true;
}


  setLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  isActiveLanguage(language: AppLanguage): boolean {
    return this.languageService.getCurrentLanguage() === language;
  }

  get userFirstName(): string {
    const firstName = this.profileForm?.get('firstName')?.value;
    if (firstName) {
      return firstName;
    }

    const email = this.profileForm?.get('email')?.value || localStorage.getItem('email') || '';
    const name = email.split('@')[0]?.split('.')[0];
    return name ? this.toTitleCase(name) : 'Employee';
  }

  get userRole(): string | null {
    return localStorage.getItem('role');
  }

  private patchProfile(profile: ProfileSettingsDto, persistTheme = false): void {
    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.substring(0, 10) : null,
      profileImage: profile.profileImage
    });

    void persistTheme;
  }

  private passwordsMatch(group: FormGroup): { passwordMismatch: true } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordMismatch: true } : null;
  }

  private errorMessage(err: any, fallback: string): string {
    return err?.error?.detail ?? err?.error?.message ?? err?.error?.Message ?? fallback;
  }

  private settingsText(key: string, fallback: string): string {
    //return this.showAdminLanguageSelector ? this.languageService.instant(key) : fallback;
    return this.languageService.instant(key) || fallback;
  }

  private toTitleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
