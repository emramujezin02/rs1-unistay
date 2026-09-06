import {ControlContainer, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive() 
export abstract class MyBaseFormControlComponent {
  public myControlName!: string;
  public customMessages: Record<string, string> = {};

  constructor(protected controlContainer: ControlContainer) {
  }

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get formControl(): FormControl {
    return this.formGroup.get(this.myControlName) as FormControl;
  }

  getErrorKeys(errors: ValidationErrors | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: unknown): string {
    if (this.customMessages[errorKey]) {
      return this.customMessages[errorKey];
    }

    const dynamicMessages: Record<string, (errorValue: unknown) => string> = {
      required: () => 'This field is required.',
      min: (value: unknown) => this.lengthErrorMessage(value, 'Minimum', 'required'),
      max: (value: unknown) => this.lengthErrorMessage(value, 'Maximum', 'allowed'),
      pattern: () => 'Invalid format.',
    };

    if (dynamicMessages[errorKey]) {
      return dynamicMessages[errorKey](errorValue);
    }

    return `Validation error: ${errorKey}`;
  }

  private lengthErrorMessage(value: unknown, label: 'Minimum' | 'Maximum', suffix: 'required' | 'allowed'): string {
    const error = value && typeof value === 'object'
      ? value as { requiredLength?: unknown; actualLength?: unknown }
      : {};

    return `${label} ${error.requiredLength} characters ${suffix}. You entered ${error.actualLength}.`;
  }

  protected getControlName(): string {
    return Object.keys(this.formGroup.controls).find(
      key => this.formGroup.get(key) === this.formControl
    ) || '';
  }
}
