import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-legend',
  standalone: true,
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
})
export class ChartLegendComponent {
  @Input() items: Array<{ label: string; color: string }> = [];
}
