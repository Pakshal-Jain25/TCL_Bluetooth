import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator = (firstField: string, secondField: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(firstField)?.value;
        const confirmPassword = control.get(secondField)?.value;

        if (password && confirmPassword && password !== confirmPassword) {
            return {
                passwordsDontMatch: true
            }
        }
        else {
            return null;
        }
    }
}