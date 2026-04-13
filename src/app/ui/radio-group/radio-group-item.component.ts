import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio-group-item',
  standalone: true,
  templateUrl: './radio-group-item.component.html',
  styleUrl: './radio-group-item.component.scss',
})
export class RadioGroupItemComponent {
  @Input() name = '';
  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();
}
