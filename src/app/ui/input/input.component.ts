import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  template:
    '<input class="input" [attr.id]="id" [attr.name]="name" [attr.type]="type" [value]="value" [attr.placeholder]="placeholder || null" [attr.autocomplete]="autocomplete || null" [attr.inputmode]="inputMode || null" [required]="required" [readonly]="readonly" [disabled]="disabled" (input)="handleInput($any($event.target).value)" (blur)="handleBlur()" />',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() id?: string;
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() autocomplete?: string;
  @Input() inputMode?: string;
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
