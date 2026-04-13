import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from 'src/app/landing/footer/footer.component';
import { HeaderComponent } from 'src/app/landing/header/header.component';
import { CareersService } from 'src/app/services/careers/careers.service';
import { AlertDescriptionComponent } from 'src/app/ui/alert/alert-description.component';
import { AlertComponent } from 'src/app/ui/alert/alert.component';
import { AlertTitleComponent } from 'src/app/ui/alert/alert-title.component';
import { AccordionComponent } from 'src/app/ui/accordion/accordion.component';
import { AccordionContentComponent } from 'src/app/ui/accordion/accordion-content.component';
import { AccordionItemComponent } from 'src/app/ui/accordion/accordion-item.component';
import { AccordionTriggerComponent } from 'src/app/ui/accordion/accordion-trigger.component';
import { BadgeComponent } from 'src/app/ui/badge/badge.component';
import { ButtonComponent } from 'src/app/ui/button/button.component';
import { CardComponent } from 'src/app/ui/card/card.component';
import { CardContentComponent } from 'src/app/ui/card/card-content.component';
import { CardDescriptionComponent } from 'src/app/ui/card/card-description.component';
import { CardHeaderComponent } from 'src/app/ui/card/card-header.component';
import { CardTitleComponent } from 'src/app/ui/card/card-title.component';
import { EmptyDescriptionComponent } from 'src/app/ui/empty/empty-description.component';
import { EmptyComponent } from 'src/app/ui/empty/empty.component';
import { EmptyHeaderComponent } from 'src/app/ui/empty/empty-header.component';
import { EmptyTitleComponent } from 'src/app/ui/empty/empty-title.component';
import { FieldComponent } from 'src/app/ui/field/field.component';
import { InputComponent } from 'src/app/ui/input/input.component';
import { SelectComponent, SelectOption } from 'src/app/ui/select/select.component';
import { TextareaComponent } from 'src/app/ui/textarea/textarea.component';
import {
  CAREER_BENEFITS,
  CAREER_HIGHLIGHTS,
  CULTURE_PILLARS,
  EXPERIENCE_LEVEL_OPTIONS,
  FEATURED_VACANCIES,
  HIRING_STEPS,
  STATE_OPTIONS,
  TALENT_AREAS,
  CareerVacancy,
} from './trabalhe-conosco.content';

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const optionalUrlValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = `${control.value ?? ''}`.trim();
  if (!value) {
    return null;
  }

  return isValidUrl(value) ? null : { invalidUrl: true };
};

const linkedinValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = `${control.value ?? ''}`.trim();
  if (!value) {
    return { required: true };
  }

  if (!isValidUrl(value) || !value.toLowerCase().includes('linkedin.com/')) {
    return { invalidLinkedin: true };
  }

  return null;
};

const phoneValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const digits = `${control.value ?? ''}`.replace(/\D/g, '');
  return digits.length >= 10 ? null : { invalidPhone: true };
};

function isValidUrl(value: string): boolean {
  const candidate = value.match(/^https?:\/\//i) ? value : `https://${value}`;

  try {
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
}

@Component({
  selector: 'front-zapfarma-trabalhe-conosco',
  standalone: true,
  templateUrl: './trabalhe-conosco.component.html',
  styleUrl: './trabalhe-conosco.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    AlertDescriptionComponent,
    AlertTitleComponent,
    AccordionComponent,
    AccordionContentComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    CardDescriptionComponent,
    CardHeaderComponent,
    CardTitleComponent,
    EmptyComponent,
    EmptyDescriptionComponent,
    EmptyHeaderComponent,
    EmptyTitleComponent,
    FieldComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
  ],
})
export class TrabalheConoscoComponent implements OnDestroy {
  @ViewChild('resumeInput') resumeInput?: ElementRef<HTMLInputElement>;

  readonly isBrowser: boolean;
  readonly careerHighlights = CAREER_HIGHLIGHTS;
  readonly culturePillars = CULTURE_PILLARS;
  readonly benefits = CAREER_BENEFITS;
  readonly talentAreas = TALENT_AREAS;
  readonly hiringSteps = HIRING_STEPS;
  readonly featuredVacancies = FEATURED_VACANCIES;
  readonly stateOptions = STATE_OPTIONS;
  readonly experienceLevelOptions = EXPERIENCE_LEVEL_OPTIONS;
  readonly interestAreaOptions: SelectOption[] = TALENT_AREAS.map((area) => ({
    value: area.title,
    label: area.title,
  }));
  readonly acceptedResumeTypes =
    '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  readonly applicationForm;

  hasSubmitted = false;
  isSubmitting = false;
  showApplicationModal = false;
  submitSuccessMessage: string | null = null;
  submitErrorMessage: string | null = null;
  resumeErrorMessage: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly formBuilder: FormBuilder,
    private readonly careersService: CareersService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.applicationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneValidator]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', Validators.required],
      linkedinUrl: ['', [Validators.required, linkedinValidator]],
      portfolioUrl: ['', [optionalUrlValidator]],
      interestArea: ['', Validators.required],
      vacancyId: [''],
      experienceLevel: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
      consentLgpd: [false, Validators.requiredTrue],
      resumeFile: [null as File | null, Validators.required],
    });
  }

  get vacancyOptions(): SelectOption[] {
    return this.featuredVacancies.map((vacancy) => ({
      value: vacancy.id,
      label: vacancy.title,
    }));
  }

  get selectedResumeName(): string | null {
    return this.applicationForm.controls.resumeFile.value?.name ?? null;
  }

  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) {
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  openApplicationModal(prefillVacancyId = ''): void {
    if (prefillVacancyId) {
      this.applicationForm.patchValue({ vacancyId: prefillVacancyId });
    }

    this.showApplicationModal = true;
    this.syncModalScrollLock();
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
    this.syncModalScrollLock();
  }

  focusVacancy(vacancy: CareerVacancy): void {
    this.openApplicationModal(vacancy.id);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (!this.showApplicationModal) {
      return;
    }

    this.closeApplicationModal();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    document.body.style.overflow = '';
  }

  handleResumeSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.resumeErrorMessage = null;
    this.applicationForm.controls.resumeFile.setErrors(null);

    if (!file) {
      this.applicationForm.controls.resumeFile.setValue(null);
      return;
    }

    if (!ALLOWED_RESUME_TYPES.has(file.type)) {
      this.resumeErrorMessage = 'Envie um currículo em PDF, DOC ou DOCX.';
      this.applicationForm.controls.resumeFile.setValue(null);
      this.applicationForm.controls.resumeFile.setErrors({ invalidResumeType: true });
      input.value = '';
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      this.resumeErrorMessage = 'O currículo deve ter no máximo 5 MB.';
      this.applicationForm.controls.resumeFile.setValue(null);
      this.applicationForm.controls.resumeFile.setErrors({ invalidResumeSize: true });
      input.value = '';
      return;
    }

    this.applicationForm.controls.resumeFile.setValue(file);
    this.applicationForm.controls.resumeFile.markAsDirty();
    this.applicationForm.controls.resumeFile.updateValueAndValidity();
  }

  clearResume(): void {
    this.applicationForm.controls.resumeFile.setValue(null);
    this.applicationForm.controls.resumeFile.markAsTouched();
    this.resumeErrorMessage = null;

    if (this.resumeInput?.nativeElement) {
      this.resumeInput.nativeElement.value = '';
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.applicationForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty || this.hasSubmitted);
  }

  submitApplication(): void {
    this.hasSubmitted = true;
    this.submitSuccessMessage = null;
    this.submitErrorMessage = null;

    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    const rawValue = this.applicationForm.getRawValue();
    const resumeFile = rawValue.resumeFile;
    const firstName = `${rawValue.firstName ?? ''}`.trim();
    const lastName = `${rawValue.lastName ?? ''}`.trim();
    const email = `${rawValue.email ?? ''}`.trim().toLowerCase();
    const phone = `${rawValue.phone ?? ''}`;
    const city = `${rawValue.city ?? ''}`.trim();
    const state = `${rawValue.state ?? ''}`;
    const linkedinUrl = `${rawValue.linkedinUrl ?? ''}`;
    const portfolioUrl = `${rawValue.portfolioUrl ?? ''}`;
    const interestArea = `${rawValue.interestArea ?? ''}`;
    const vacancyId = `${rawValue.vacancyId ?? ''}`;
    const experienceLevel = `${rawValue.experienceLevel ?? ''}`;
    const message = `${rawValue.message ?? ''}`.trim();

    if (!(resumeFile instanceof File)) {
      this.resumeErrorMessage = 'Anexe seu currículo para concluir a candidatura.';
      this.applicationForm.controls.resumeFile.setErrors({ required: true });
      return;
    }

    const vacancy = this.featuredVacancies.find((item) => item.id === vacancyId);
    this.isSubmitting = true;

    this.careersService
      .submitApplication({
        firstName,
        lastName,
        email,
        phone: this.normalizePhone(phone),
        city,
        state,
        linkedinUrl: this.normalizeUrl(linkedinUrl),
        portfolioUrl: portfolioUrl ? this.normalizeUrl(portfolioUrl) : '',
        interestArea,
        interestAreaLabel: this.getOptionLabel(this.interestAreaOptions, interestArea),
        vacancyId,
        vacancyTitle: vacancy?.title || '',
        experienceLevel,
        experienceLevelLabel: this.getOptionLabel(
          this.experienceLevelOptions,
          experienceLevel
        ),
        message,
        consentLgpd: !!rawValue.consentLgpd,
        submittedAt: new Date().toISOString(),
        pageUrl: this.getCurrentPageUrl(),
        resumeFile,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccessMessage =
            'Candidatura enviada com sucesso. Seus dados foram recebidos pela API de talentos da Zapfarma.';
          this.resetForm();
        },
        error: () => {
          this.isSubmitting = false;
          this.submitErrorMessage =
            'Não foi possível enviar sua candidatura agora. Tente novamente em instantes.';
        },
      });
  }

  private getCurrentPageUrl(): string {
    if (!this.isBrowser) {
      return '';
    }

    return window.location.href;
  }

  private resetForm(): void {
    this.hasSubmitted = false;
    this.resumeErrorMessage = null;
    this.applicationForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      linkedinUrl: '',
      portfolioUrl: '',
      interestArea: '',
      vacancyId: '',
      experienceLevel: '',
      message: '',
      consentLgpd: false,
      resumeFile: null,
    });
    this.clearResume();
  }

  private normalizePhone(phone: string): string {
    return `${phone ?? ''}`.replace(/\D/g, '');
  }

  private normalizeUrl(value: string): string {
    const trimmed = value.trim();
    return trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`;
  }

  private getOptionLabel(options: SelectOption[], value: string): string {
    return options.find((option) => option.value === value)?.label || value;
  }

  private syncModalScrollLock(): void {
    if (!this.isBrowser) {
      return;
    }

    document.body.style.overflow = this.showApplicationModal ? 'hidden' : '';
  }
}
