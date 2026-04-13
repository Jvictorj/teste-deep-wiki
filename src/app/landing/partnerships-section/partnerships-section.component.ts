import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type PartnershipLogo = {
  name: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageSrcDark?: string;
  imageDarkWidth?: number;
  imageDarkHeight?: number;
  featured?: boolean;
  logoClass?: string;
};

@Component({
  selector: 'app-partnerships-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './partnerships-section.component.html',
  styleUrl: './partnerships-section.component.scss',
})
export class PartnershipsSectionComponent implements OnInit, OnDestroy {
  private autoplayTimer?: ReturnType<typeof setInterval>;

  activePartnershipIndex = 0;

  readonly partnerships: PartnershipLogo[] = [
    {
      name: 'AWS Startups',
      imageSrc: 'assets/imgs/logo-security/logo-aws/aws-startup-logo-dark.png',
      imageSrcDark:
        'assets/imgs/logo-security/logo-aws/aws-startup-logo-light.png',
      imageAlt: 'Logo da parceria AWS Startups',
      imageWidth: 1536,
      imageHeight: 512,
      imageDarkWidth: 538,
      imageDarkHeight: 141,
      logoClass: 'partnership-logo--aws-startups',
    },
    {
      name: 'Powered by AWS',
      imageSrc: 'assets/imgs/logo-security/logo-aws/aws-powered-by-dark.png',
      imageSrcDark:
        'assets/imgs/logo-security/logo-aws/aws-powered-light.png',
      imageAlt: 'Logo da parceria Powered by AWS',
      imageWidth: 1536,
      imageHeight: 513,
      imageDarkWidth: 1536,
      imageDarkHeight: 513,
    },
    {
      name: 'AWS Active',
      imageSrc: 'assets/imgs/logo-security/logo-aws/aws-active-logo-dark.png',
      imageSrcDark:
        'assets/imgs/logo-security/logo-aws/aws-active-light.png',
      imageAlt: 'Logo da parceria AWS Active',
      imageWidth: 1536,
      imageHeight: 513,
      imageDarkWidth: 434,
      imageDarkHeight: 116,
      logoClass: 'partnership-logo--aws-active',
    },
    {
      name: 'Meta Tech Provider',
      imageSrc: 'assets/imgs/logo-security/logo-meta/meta-tech-provider-black.png',
      imageSrcDark:
        'assets/imgs/logo-security/logo-meta/meta-tech-provider-white.png',
      imageAlt: 'Logo da parceria Meta Tech Provider',
      imageWidth: 650,
      imageHeight: 383,
      imageDarkWidth: 2688,
      imageDarkHeight: 1568,
      logoClass: 'partnership-logo--meta',
    },
    {
      name: 'NVIDIA Inception',
      imageSrc: 'assets/imgs/logo-security/logo-nvidia/nvidia-inception-logo.png',
      imageSrcDark:
        'assets/imgs/logo-security/logo-nvidia/nvidia-inception-badge-white.png',
      imageAlt: 'Logo da parceria NVIDIA Inception',
      imageWidth: 1221,
      imageHeight: 662,
      imageDarkWidth: 1221,
      imageDarkHeight: 662,
      featured: true,
      logoClass: 'partnership-logo--nvidia',
    },
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.clearAutoplay();
  }

  prevPartnership(): void {
    this.activePartnershipIndex =
      (this.activePartnershipIndex - 1 + this.partnerships.length) %
      this.partnerships.length;
    this.restartAutoplay();
  }

  nextPartnership(): void {
    this.activePartnershipIndex =
      (this.activePartnershipIndex + 1) % this.partnerships.length;
    this.restartAutoplay();
  }

  selectPartnership(index: number): void {
    this.activePartnershipIndex = index;
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    this.clearAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.activePartnershipIndex =
        (this.activePartnershipIndex + 1) % this.partnerships.length;
    }, 2000);
  }

  private restartAutoplay(): void {
    this.startAutoplay();
  }

  private clearAutoplay(): void {
    if (!this.autoplayTimer) {
      return;
    }

    clearInterval(this.autoplayTimer);
    this.autoplayTimer = undefined;
  }
}
