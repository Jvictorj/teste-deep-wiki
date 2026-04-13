import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  template:
    '<textarea class="textarea" [attr.id]="id" [attr.name]="name" [value]="value" [attr.placeholder]="placeholder || null" [attr.rows]="rows" [required]="required" [readonly]="readonly" [disabled]="disabled" (input)="handleInput($any($event.target).value)" (blur)="handleBlur()"></textarea>',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() id?: string;
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() required = false;
  @Input() readonly = false;

  value = '';
  disabled = false;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  handleInput(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | null | undefined): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
