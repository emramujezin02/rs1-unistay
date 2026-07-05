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

  getErrorMessage(errorKey: string, errorValue: any): string {
    if (this.customMessages[errorKey]) {
      return this.customMessages[errorKey];
    }

    const dynamicMessages: { [key: string]: (errorValue: any) => string } = {
      required: () => 'This field is required.',
      min: (value: any) => `Minimum ${value.requiredLength} characters required. You entered ${value.actualLength}.`,
      max: (value: any) => `Maximum ${value.requiredLength} characters allowed. You entered ${value.actualLength}.`,
      pattern: () => 'Invalid format.',
    };

    if (dynamicMessages[errorKey]) {
      return dynamicMessages[errorKey](errorValue);
    }

    return `Validation error: ${errorKey}`;
  }

  protected getControlName(): string {
    return Object.keys(this.formGroup.controls).find(
      key => this.formGroup.get(key) === this.formControl
    ) || '';
  }
}
