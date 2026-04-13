import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type ErpIntegration = {
  name: string;
  src: string;
  srcWidth?: number;
  srcHeight?: number;
  srcDark?: string;
  srcDarkWidth?: number;
  srcDarkHeight?: number;
  logoClass?: string;
};

@Component({
  selector: 'app-integration-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './integration-section.component.html',
  styleUrl: './integration-section.component.scss',
})
export class IntegrationSectionComponent implements OnInit, OnDestroy {
  activeIntegrationIndex = 0;
  private autoAdvanceId: ReturnType<typeof setInterval> | null = null;

  readonly erpIntegrations: ErpIntegration[] = [
    {
      name: 'ASASys',
      src: 'assets/imgs/logo-erp/ASAsys-erp-branco.png',
      srcWidth: 402,
      srcHeight: 125,
      srcDark: 'assets/imgs/logo-erp/ASAsys-erp-dark.png',
      srcDarkWidth: 1536,
      srcDarkHeight: 1024,
      logoClass: 'erp-logo--asasys',
    },
    {
      name: 'FarmaSoft',
      src: 'assets/imgs/logo-erp/logo-farmasoft-erp.webp',
      logoClass: 'erp-logo--farmasoft',
    },
    {
      name: 'InovaFarma',
      src: 'assets/imgs/logo-erp/logo-inovafarma-erp.svg',
      srcWidth: 239,
      srcHeight: 38,
      logoClass: 'erp-logo--inovafarma',
    },
    {
      name: 'Big Sistemas',
      src: 'assets/imgs/logo-erp/Big-erp-.png',
      srcWidth: 275,
      srcHeight: 98,
      logoClass: 'erp-logo--big',
    },
    {
      name: 'Trier Drogarias',
      src: 'assets/imgs/logo-erp/trier-sistemas-no-bg.png',
      srcWidth: 300,
      srcHeight: 92,
      logoClass: 'erp-logo--trier',
    },
    {
      name: 'Alpha Software',
      src: 'assets/imgs/logo-erp/alpha7-erp.png',
      srcWidth: 155,
      srcHeight: 49,
      logoClass: 'erp-logo--alpha',
    },
  ];

  extraFeatures = [
    { icon: 'receipt_long', text: 'Finaliza todo o processo de venda automaticamente' },
    { icon: 'mic', text: 'Entende áudio, imagens e lê receitas médicas' },
    { icon: 'send', text: 'Realiza pós-venda com clientes cadastrados' },
    { icon: 'description', text: 'Emite o pedido direto no caixa da farmácia' },
  ];

  ngOnInit(): void {
    this.startAutoAdvance();
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  nextIntegration(): void {
    this.activeIntegrationIndex =
      (this.activeIntegrationIndex + 1) % this.erpIntegrations.length;
    this.restartAutoAdvance();
  }

  prevIntegration(): void {
    this.activeIntegrationIndex =
      (this.activeIntegrationIndex - 1 + this.erpIntegrations.length) %
      this.erpIntegrations.length;
    this.restartAutoAdvance();
  }

  goToIntegration(index: number): void {
    this.activeIntegrationIndex = index;
    this.restartAutoAdvance();
  }

  private startAutoAdvance(): void {
    if (this.autoAdvanceId) {
      return;
    }
    this.autoAdvanceId = setInterval(() => {
      this.activeIntegrationIndex =
        (this.activeIntegrationIndex + 1) % this.erpIntegrations.length;
    }, 2000);
  }

  private stopAutoAdvance(): void {
    if (!this.autoAdvanceId) {
      return;
    }
    clearInterval(this.autoAdvanceId);
    this.autoAdvanceId = null;
  }

  private restartAutoAdvance(): void {
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }
}
