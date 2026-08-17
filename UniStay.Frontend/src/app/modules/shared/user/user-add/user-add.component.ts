import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WizardService } from '../../../../services/wizard-services/wizard.service';
import {UserCreateEndpointService} from '../../../../endpoints/user-endpoints/user-create-endpoint.service';


@Component({
  selector: 'app-user-add',
  standalone: false,
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddComponent {
  private readonly studentRoleId = 2;

  wizardService = inject(WizardService);
  // FIX: Inlined inject(FormBuilder) calls to work around a potential type inference issue with the class property.
  fb = inject(FormBuilder);

  userCreateService = inject(UserCreateEndpointService);
  currentStep = signal(1);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  eyeIcon = "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z";
  eyeSlashIcon = "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395 M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774 M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21";


  steps = [
    { number: 1, label: 'Name' },
    { number: 2, label: 'Birth Date' },
    { number: 3, label: 'Email' },
    { number: 4, label: 'Password' },
    { number: 5, label: 'Phone' },
    { number: 6, label: 'Username' },
  ];

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /*passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && value.length >= 8;
    return !isValid ? { passwordStrength: true } : null;
  }*/

  // FIX: Replaced this.fb with direct inject(FormBuilder) calls to resolve type inference errors.
  userForm = inject(FormBuilder).group({
    step1: inject(FormBuilder).group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    }),
    step2: inject(FormBuilder).group({
      dateOfBirth: ['', Validators.required],
    }),
    step3: inject(FormBuilder).group({
      email: ['', [Validators.required, Validators.email]],
    }),
    step4: inject(FormBuilder).group({
      password: ['', [Validators.required, this.passwordsMatchValidator]],
      confirmPassword: [''],
    }, { validators: this.passwordsMatchValidator }),
    step5: inject(FormBuilder).group({
      phone: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')]],
    }),
    step6: inject(FormBuilder).group({
      username: [''],
    }),
  });


  get isStep1Valid() { return this.userForm.get('step1')?.valid ?? false; }
  get isStep2Valid() { return this.userForm.get('step2')?.valid ?? false; }
  get isStep3Valid() { return this.userForm.get('step3')?.valid ?? false; }
  get isStep4Valid() { return this.userForm.get('step4')?.valid ?? false; }
  get isStep5Valid() { return this.userForm.get('step5')?.valid ?? false; }

  get isCurrentStepValid() {
    switch (this.currentStep()) {
      case 1: return this.isStep1Valid;
      case 2: return this.isStep2Valid;
      case 3: return this.isStep3Valid;
      case 4: return this.isStep4Valid;
      case 5: return this.isStep5Valid;
      default: return true;
    }
  }

 /* passwordStrength = computed(() => {
    const password = this.userForm.get('step4.password')?.value ?? '';
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  });

  passwordCriteria = computed(() => {
    const password = this.userForm.get('step4.password')?.value ?? '';

    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
  });*/

  nextStep() {
    if (this.isCurrentStepValid) {
      if (this.currentStep() < this.steps.length) {
        this.currentStep.update((step) => step + 1);
      }
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  skipAndSubmit() {
    this.onSubmit();
  }

  onSubmit() {
    console.log("Radi");
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();

    const request = {
      firstName: formValue.step1.firstName ?? "",
      lastName: formValue.step1.lastName ?? "",
      dateOfBirth: formValue.step2.dateOfBirth ?? "",
      email: formValue.step3.email ?? "",
      password: formValue.step4.password ?? "",
      phone: formValue.step5.phone ?? "",
      username: formValue.step6.username ?? "",
      profileImage: "",
      roleId: this.studentRoleId
    };

    this.userCreateService.createUser(request).subscribe({
      next: (res) => {
        console.log('User created successfully!', res);
        alert('User account created successfully!');
        this.closeWizard();
      },
      error: (err) => {
        console.error('Error creating user:', err);

        const message =
          err.error?.message ||       // backend BadRequest { message: "..." }
          err.error ||                // fallback
          "Failed to create account."; // default

        alert(message);
      }
    });
  }


  closeWizard() {
    this.wizardService.close();
    setTimeout(() => {
      this.userForm.reset();
      this.currentStep.set(1);
    }, 300); // Wait for modal to close
  }

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update((v) => !v);
  }
}
