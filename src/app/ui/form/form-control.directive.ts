import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appFormControl]',
  standalone: true,
})
export class FormControlDirective {
  @Input() describedBy?: string;
}
