import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SelectOption = { label: string; value: string };

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() value = '';
  @Input() placeholder = 'Selecione...';
  @Input() id?: string;
  @Input() name?: string;
  @Input() required = false;
  @Output() valueChange = new EventEmitter<string>();

  disabled = false;
  private propagateChange: (value: string) => void = () => {};
  private propagateTouched: () => void = () => {};

  handleChange(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
    this.propagateChange(value);
  }

  onBlur(): void {
    this.propagateTouched();
  }

  writeValue(value: string | null | undefined): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
