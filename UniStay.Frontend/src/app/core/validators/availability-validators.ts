import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { ApplicationEndpointService } from '../../endpoints/application-endpoints/application-endpoint.service';
import { UserAvailabilityEndpointService } from '../../endpoints/user-availability-endpoints/user-availability-endpoint.service';

export function emailTakenValidator(api: UserAvailabilityEndpointService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.hasError('required') || control.hasError('email')) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => api.checkEmail(control.value)),
      map(result => result.isAvailable ? null : { emailTaken: true }),
      catchError(() => of(null))
    );
  };
}

export function usernameTakenValidator(api: UserAvailabilityEndpointService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.hasError('required') || control.hasError('maxlength')) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => api.checkUsername(control.value)),
      map(result => result.isAvailable ? null : { usernameTaken: true }),
      catchError(() => of(null))
    );
  };
}

export function gpaEligibleValidator(api: ApplicationEndpointService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    if (value === null || value === '' || value === undefined) {
      return of(null);
    }

    return timer(400).pipe(
      switchMap(() => api.getMinimumGpa()),
      map(result => {
        const actual = Number(value);
        return actual >= result.minimumGpa
          ? null
          : { gpaTooLow: { min: result.minimumGpa, actual } };
      }),
      catchError(() => of(null))
    );
  };
}
