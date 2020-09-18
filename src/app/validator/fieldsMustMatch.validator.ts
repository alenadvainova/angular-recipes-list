import { FormGroup } from "@angular/forms";

export function FieldsMustMatch(controlName: string, controlNameMatch: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const controlMatch = formGroup.controls[controlNameMatch];

    if (!control || !controlMatch) {
      return null;
    }

    if (controlMatch.errors) {
      return null;
    }

    if (control.value !== controlMatch.value) {
      controlMatch.setErrors({ mustMatch: true });
    } else {
      controlMatch.setErrors(null);
    }
  };
}
