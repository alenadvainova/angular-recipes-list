import {
  Validator,
  FormGroup,
  ValidationErrors,
  NG_VALIDATORS,
} from "@angular/forms";
import { Input, Directive } from "@angular/core";

import { FieldsMustMatch } from "../validator/fieldsMustMatch.validator";

@Directive({
  selector: "[fieldsMustMatch]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FieldsMustMatchDerective,
      multi: true,
    },
  ],
})
export class FieldsMustMatchDerective implements Validator {
  @Input("fieldsMustMatch") fieldsMustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors {
    if (this.fieldsMustMatch.length < 2) {
      return null;
    }
    return FieldsMustMatch(
      this.fieldsMustMatch[0],
      this.fieldsMustMatch[1]
    )(formGroup);
  }
}
