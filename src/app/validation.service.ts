import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static NameValidator(control: AbstractControl): ValidationErrors | null 
  {
    const value = control.value;
    // Perform custom validation logic here
    if (value.match(/^[a-zA-Z ]*$/)) {
      return null; // Validation passed
    } else {
      return { custom: true }; // Validation failed
    }
  }

  static PhoneValidator(control: AbstractControl): ValidationErrors | null 
  {
    const value = control.value;
    // Perform custom validation logic here
    if ((value.match(/^[0-9]*$/)) && (value.length == 10)) {
      return null; // Validation passed
    }
    else 
    {
      return { custom: true }; // Validation failed
    }
  }

  static NumberValidator(control: AbstractControl): ValidationErrors | null 
  {
    const value = control.value;
    // Perform custom validation logic here
    if (value.match(/^[0-9]*$/)) {
      return null; // Validation passed
    }
    else 
    {
      return { custom: true }; // Validation failed
    }
  }

  static EmailValidator(control: AbstractControl): ValidationErrors | null 
  {
    const value = control.value;
    // Perform custom validation logic here
    if (value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return null; // Validation passed
    } else {
      return { custom: true }; // Validation failed
    }
  }
}
