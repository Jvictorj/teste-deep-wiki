import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './results-section.component.html',
  styleUrl: './results-section.component.scss',
})
export class ResultsSectionComponent {
  stats = [
    { value: '+40%', label: 'Aumento', sublabel: 'Faturamento Delivery' },
    { value: '100%', label: 'Redução', sublabel: 'Tempo Resposta' },
    { value: '4x', label: 'Mais Pedidos', sublabel: 'Finalizados via Chat' },
  ];
}
