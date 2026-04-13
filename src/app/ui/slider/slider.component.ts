import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 50;
}
