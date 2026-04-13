import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aspect-ratio',
  standalone: true,
  templateUrl: './aspect-ratio.component.html',
  styleUrl: './aspect-ratio.component.scss',
})
export class AspectRatioComponent {
  @Input() ratio = 1;
}
