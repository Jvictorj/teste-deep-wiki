import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-image',
  standalone: true,
  templateUrl: './avatar-image.component.html',
  styleUrl: './avatar-image.component.scss',
})
export class AvatarImageComponent {
  @Input() src = '';
  @Input() alt = '';
}
