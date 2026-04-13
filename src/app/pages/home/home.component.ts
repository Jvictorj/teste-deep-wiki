import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../landing/header/header.component';
import { HeroComponent } from '../../landing/hero/hero.component';
import { ProblemSectionComponent } from '../../landing/problem-section/problem-section.component';
import { StepsSectionComponent } from '../../landing/steps-section/steps-section.component';
import { ResultsSectionComponent } from '../../landing/results-section/results-section.component';
import { TestimonialsSectionComponent } from '../../landing/testimonials-section/testimonials-section.component';
import { CalculatorSectionComponent } from '../../landing/calculator-section/calculator-section.component';
import { PartnershipsSectionComponent } from '../../landing/partnerships-section/partnerships-section.component';
import { FeaturesSectionComponent } from '../../landing/features-section/features-section.component';
import { IntegrationSectionComponent } from '../../landing/integration-section/integration-section.component';
import { PricingSectionComponent } from '../../landing/pricing-section/pricing-section.component';
import { FaqSectionComponent } from '../../landing/faq-section/faq-section.component';
import { CtaSectionComponent } from '../../landing/cta-section/cta-section.component';
import { ContactSectionComponent } from '../../landing/contact-section/contact-section.component';
import { FooterComponent } from '../../landing/footer/footer.component';
import { ChatIaWidgetComponent } from '../../shared/chat-ia-widget/chat-ia-widget.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'front-zapfarma-home',
  standalone: true,
  imports: [
    MatIconModule,
    HeaderComponent,
    HeroComponent,
    ProblemSectionComponent,
    StepsSectionComponent,
    ResultsSectionComponent,
    TestimonialsSectionComponent,
    CalculatorSectionComponent,
    PartnershipsSectionComponent,
    FeaturesSectionComponent,
    IntegrationSectionComponent,
    PricingSectionComponent,
    FaqSectionComponent,
    CtaSectionComponent,
    ContactSectionComponent,
    FooterComponent,
    ChatIaWidgetComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly openChatOnInit: boolean;
  private readonly isBrowser: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.openChatOnInit = this.route.snapshot.data['openChatIa'] === true;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Intentionally left blank so Angular updates the template bindings
    // that depend on the current scroll position.
  }

  get showBackToTop(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return window.scrollY > 320;
  }

  scrollToTop(): void {
    if (!this.isBrowser) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
