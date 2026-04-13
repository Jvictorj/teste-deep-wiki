import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatIconModule],
  template: '<mat-icon class="spinner" aria-label="Loading">progress_activity</mat-icon>',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {}


