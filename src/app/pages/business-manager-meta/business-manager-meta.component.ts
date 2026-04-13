import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'front-zapfarma-business-manager-meta',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, RodapeComponent],
  templateUrl: './business-manager-meta.component.html',
  styleUrls: ['./business-manager-meta.component.scss'],
})
export class BusinessManagerMetaComponent {}
