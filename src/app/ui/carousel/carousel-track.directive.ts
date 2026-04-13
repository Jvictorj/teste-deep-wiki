import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[carouselTrack]',
  standalone: true,
})
export class CarouselTrackDirective {
  @HostBinding('class')
  get classes(): string {
    return 'carousel-track';
  }
}
