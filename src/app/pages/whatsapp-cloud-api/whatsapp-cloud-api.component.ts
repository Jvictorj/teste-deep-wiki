import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'front-zapfarma-whatsapp-cloud-api',
  standalone: true,
  templateUrl: './whatsapp-cloud-api.component.html',
  styleUrls: ['./whatsapp-cloud-api.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatIconModule, ToolbarComponent, RodapeComponent],
})
export class WhatsappCloudApiComponent {}
