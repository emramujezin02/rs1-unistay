import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthRegisterEndpointService } from '../../../endpoints/auth-endpoints/auth-register-endpoint.service';
import { InviteSendEndpointService } from '../../../endpoints/invite-endpoints/invite-send-endpoint.service';
import { UserAvailabilityEndpointService } from '../../../endpoints/user-availability-endpoints/user-availability-endpoint.service';
import { emailTakenValidator, usernameTakenValidator } from '../../../core/validators/availability-validators';
import { MyConfig } from '../../../my-config';

function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ?? '';
    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};
    if (!/[A-Z]/.test(value)) {
      errors['noUppercase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['noLowercase'] = true;
    }
    if (!/[0-9]/.test(value)) {
      errors['noDigit'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}

function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  readonly steps = [
    { label: 'Personal' },
    { label: 'Account' },
    { label: 'Security' }
  ];

  form: FormGroup;
  currentStep = 0;
  direction: 'forward' | 'back' = 'forward';
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  protected readonly recaptchaSiteKey = MyConfig.recaptchaSiteKey;
  private inviteToken: string | null = null;
  private inviteEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerEndpoint: AuthRegisterEndpointService,
    private availabilityEndpoint: UserAvailabilityEndpointService,
    private inviteService: InviteSendEndpointService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      personal: this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]]
      }),
      account: this.fb.group({
        username: this.fb.control('', {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [usernameTakenValidator(this.availabilityEndpoint)],
          updateOn: 'blur'
        }),
        email: this.fb.control('', {
          validators: [Validators.required, Validators.email, Validators.maxLength(200)],
          asyncValidators: [emailTakenValidator(this.availabilityEndpoint)],
          updateOn: 'blur'
        })
      }),
      security: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          passwordStrengthValidator()
        ]],
        confirmPassword: ['', Validators.required],
        captchaToken: ['', Validators.required]
      }, { validators: passwordsMatchValidator() })
    });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('invite');

    if (!token) {
      return;
    }

    this.inviteService.validateInviteToken(token).subscribe({
      next: invite => {
        if (invite.used || invite.isExpired) {
          this.inviteToken = null;
          this.inviteEmail = null;
          this.errorMessage = 'Invite link nije validan ili je istekao.';
          return;
        }

        this.inviteToken = token;
        this.inviteEmail = invite.email;
        this.accountGroup.patchValue({ email: invite.email });
      },
      error: () => {
        this.inviteToken = null;
        this.inviteEmail = null;
        this.errorMessage = 'Invite link nije validan ili je istekao.';
      }
    });
  }

  get personalGroup(): FormGroup {
    return this.form.get('personal') as FormGroup;
  }

  get accountGroup(): FormGroup {
    return this.form.get('account') as FormGroup;
  }

  get securityGroup(): FormGroup {
    return this.form.get('security') as FormGroup;
  }

  private get activeGroup(): FormGroup {
    return [this.personalGroup, this.accountGroup, this.securityGroup][this.currentStep];
  }

  get usernamePending(): boolean {
    return this.accountGroup.get('username')?.pending ?? false;
  }

  get emailPending(): boolean {
    return this.accountGroup.get('email')?.pending ?? false;
  }

  get passwordMismatch(): boolean {
    return !!(this.securityGroup.get('confirmPassword')?.touched && this.securityGroup.hasError('passwordMismatch'));
  }

  passwordHasError(code: string): boolean {
    const control = this.securityGroup.get('password');
    return !!(control?.touched && control.hasError(code));
  }

  isStepDone(index: number): boolean {
    return index < this.currentStep;
  }

  isStepActive(index: number): boolean {
    return index === this.currentStep;
  }

  next(): void {
    this.errorMessage = '';

    if (this.activeGroup.pending) {
      return;
    }

    if (this.activeGroup.invalid) {
      this.activeGroup.markAllAsTouched();
      return;
    }

    this.direction = 'forward';
    this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
  }

  back(): void {
    this.errorMessage = '';
    this.direction = 'back';
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  close(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.securityGroup.pending) {
      return;
    }

    if (this.securityGroup.invalid) {
      this.securityGroup.markAllAsTouched();
      return;
    }

    const { firstName, lastName } = this.personalGroup.value;
    const { username, email } = this.accountGroup.value;
    const { password, captchaToken } = this.securityGroup.value;

    if (this.inviteToken && this.inviteEmail && email?.toString().trim().toLowerCase() !== this.inviteEmail.trim().toLowerCase()) {
      this.errorMessage = 'Email mora odgovarati email adresi iz invite linka.';
      return;
    }

    this.loading = true;

    this.registerEndpoint.register({
      firstName,
      lastName,
      username,
      email,
      password,
      captchaToken,
      inviteToken: this.inviteToken
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.successMessage = 'Racun je kreiran. Mozete se prijaviti.';
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message
          ?? error?.error?.detail
          ?? 'Registracija nije uspjela. Provjerite podatke i pokusajte ponovo.';
      }
    });
  }
}

