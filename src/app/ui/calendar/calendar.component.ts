import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MatCalendar, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  @Input() selected: Date | null = null;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() startAt?: Date;
  @Output() selectedChange = new EventEmitter<Date>();

  onSelectedChange(date: Date): void {
    this.selected = date;
    this.selectedChange.emit(date);
  }
}
