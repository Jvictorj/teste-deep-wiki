import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export type ChartConfig = Record<string, { label?: string; color?: string }>;

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './chart-container.component.html',
  styleUrl: './chart-container.component.scss',
})
export class ChartContainerComponent {
  @Input() config: ChartConfig = {};
  @Input() view: [number, number] = [600, 300];
  @Input() scheme: { domain: string[] } = { domain: [] };
}
