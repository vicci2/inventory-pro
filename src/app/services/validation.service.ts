import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public getErrorMessage(control: AbstractControl | null): string {
    if (!control) return '';
  
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email';
    if (control.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} characters required`;
    }
    if (control.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} characters allowed`;
    }
    if (control.hasError('min')) {
      return `Value must be at least ${control.errors?.['min'].min}`;
    }
    if (control.hasError('max')) {
      return `Value cannot be more than ${control.errors?.['max'].max}`;
    }
    if (control.hasError('pattern')) return 'Invalid input pattern';
    if (control.hasError('mismatch')) return 'Passwords do not match';
  
    return '';
  }
  
}
