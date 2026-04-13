import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { environment } from 'src/environments/environments';
import {
  CalApiError,
  CalBookingRequest,
  CalSlot,
  CalSlotsRequest,
  CalcomService,
} from 'src/app/services/calcom/calcom.service';

interface LeadFormData {
  name: string;
  phone: string;
  drugstoreCount: string;
}

interface SlotDayGroup {
  dayKey: string;
  label: string;
  slots: CalSlot[];
}

@Component({
  selector: 'front-zapfarma-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NgxMaskDirective],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
  providers: [provideNgxMask()],
})
export class ContactSectionComponent {
  private readonly defaultCalDemoUrl = 'https://cal.com/zapfarma/demo';
  private readonly defaultEventTypeSlug = 'demo';
  private readonly defaultUsername = 'zapfarma';
  private readonly defaultDurationMinutes = 30;
  readonly useCalApiScheduling = !!environment.calUseApiScheduling;

  showThankYouModal = false;
  submitError: string | null = null;
  thankYouVideoUrl: SafeResourceUrl;

  loadingSlots = false;
  slotsError: string | null = null;
  availableSlots: CalSlot[] = [];
  dayGroups: SlotDayGroup[] = [];
  selectedDayKey: string | null = null;
  selectedSlot: CalSlot | null = null;

  bookingEmail = '';
  bookingPhone = '';
  bookingSubmitting = false;
  bookingError: string | null = null;
  bookingSuccessMessage: string | null = null;

  lastLeadData: LeadFormData | null = null;

  formData: LeadFormData = {
    name: '',
    phone: '',
    drugstoreCount: '',
  };

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly calcomService: CalcomService
  ) {
    this.thankYouVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    );
  }

  closeThankYouModal(): void {
    this.showThankYouModal = false;
  }

  handleSubmit(): void {
    const nome = `${this.formData.name ?? ''}`.trim();
    const telefone = `${this.formData.phone ?? ''}`.trim();
    const quantidadeDrogarias = `${this.formData.drugstoreCount ?? ''}`.trim();

    if (!nome || !telefone || !quantidadeDrogarias) {
      this.submitError = 'Preencha todos os campos antes de enviar.';
      return;
    }

    this.submitError = null;
    this.lastLeadData = {
      name: nome,
      phone: telefone,
      drugstoreCount: quantidadeDrogarias,
    };

    this.resetSchedulerState();
    this.showThankYouModal = true;
    this.bookingPhone = this.formatPhoneWithBrazilCountryCode(telefone);
    if (this.useCalApiScheduling) {
      this.loadAvailableSlots();
    }

    this.formData = {
      name: '',
      phone: '',
      drugstoreCount: '',
    };
  }

  loadAvailableSlots(): void {
    const payload = this.buildSlotsPayload();

    this.loadingSlots = true;
    this.slotsError = null;
    this.availableSlots = [];
    this.dayGroups = [];
    this.selectedDayKey = null;
    this.selectedSlot = null;

    this.pushAnalyticsEvent('slots_loading_started', {
      source: 'thankyou_modal',
    });

    this.calcomService.listSlots(payload).subscribe({
      next: (response) => {
        this.loadingSlots = false;
        this.availableSlots = this.sortSlots(response.slots);
        this.dayGroups = this.groupSlotsByDay(this.availableSlots);

        if (!this.availableSlots.length) {
          this.slotsError = 'Nenhum horário disponível no momento. Tente novamente em instantes.';
          this.pushAnalyticsEvent('slots_loaded_empty', {
            source: 'thankyou_modal',
          });
          return;
        }

        this.selectedDayKey = this.dayGroups[0]?.dayKey || null;

        this.pushAnalyticsEvent('slots_loaded', {
          source: 'thankyou_modal',
          totalSlots: String(this.availableSlots.length),
        });
      },
      error: (error: unknown) => {
        this.loadingSlots = false;
        this.availableSlots = [];
        this.slotsError = this.extractApiErrorMessage(error, 'Não foi possível carregar os horários agora.');

        this.pushAnalyticsEvent('slots_load_error', {
          source: 'thankyou_modal',
        });
      },
    });
  }

  selectSlot(slot: CalSlot): void {
    this.selectedSlot = slot;
    this.bookingError = null;
    this.bookingSuccessMessage = null;

    this.pushAnalyticsEvent('slot_selected', {
      source: 'thankyou_modal',
      start: slot.start,
    });
  }

  selectDay(dayKey: string): void {
    this.selectedDayKey = dayKey;
  }

  getSelectedDaySlots(): CalSlot[] {
    if (!this.selectedDayKey) {
      return [];
    }

    return this.dayGroups.find((group) => group.dayKey === this.selectedDayKey)?.slots ?? [];
  }

  submitBooking(): void {
    if (!this.lastLeadData) {
      this.bookingError = 'Não encontramos os dados do contato. Reenvie o formulário.';
      return;
    }

    if (!this.selectedSlot) {
      this.bookingError = 'Selecione um horário para continuar.';
      return;
    }

    const email = `${this.bookingEmail ?? ''}`.trim();
    if (!email || !this.isValidEmail(email)) {
      this.bookingError = 'Informe um e-mail válido para receber a confirmação do agendamento.';
      return;
    }

    const phoneNumber = this.normalizePhoneNumberToE164(this.bookingPhone);
    if (!phoneNumber) {
      this.bookingError = 'Informe um telefone para concluir o agendamento.';
      return;
    }

    const payload = this.buildCreateBookingPayload(email, phoneNumber);

    this.bookingSubmitting = true;
    this.bookingError = null;
    this.bookingSuccessMessage = null;

    this.pushAnalyticsEvent('booking_submitted', {
      source: 'thankyou_modal',
      start: payload.start,
    });

    this.calcomService.createBooking(payload).subscribe({
      next: () => {
        this.bookingSubmitting = false;
        this.bookingSuccessMessage = 'Demo agendada com sucesso! Você receberá a confirmação por e-mail.';

        this.pushAnalyticsEvent('booking_success', {
          source: 'thankyou_modal',
          start: payload.start,
        });
      },
      error: (error: unknown) => {
        this.bookingSubmitting = false;
        this.bookingError = this.extractApiErrorMessage(error, 'Não foi possível concluir o agendamento.');

        this.pushAnalyticsEvent('booking_error', {
          source: 'thankyou_modal',
          start: payload.start,
        });
      },
    });
  }

  isSlotSelected(slot: CalSlot): boolean {
    return this.selectedSlot?.start === slot.start;
  }

  formatSlot(slot: CalSlot): string {
    const date = new Date(slot.start);
    const timeZone = slot.timeZone || this.getUserTimezone();

    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone,
    }).format(date);
  }

  formatSlotTime(slot: CalSlot): string {
    const date = new Date(slot.start);
    const timeZone = slot.timeZone || this.getUserTimezone();

    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone,
    }).format(date);
  }

  getFallbackCalDemoUrl(): string {
    return environment.calDemoBaseUrl || this.defaultCalDemoUrl;
  }

  private resetSchedulerState(): void {
    this.loadingSlots = false;
    this.slotsError = null;
    this.availableSlots = [];
    this.dayGroups = [];
    this.selectedDayKey = null;
    this.selectedSlot = null;

    this.bookingEmail = '';
    this.bookingPhone = '';
    this.bookingSubmitting = false;
    this.bookingError = null;
    this.bookingSuccessMessage = null;
  }

  private buildSlotsPayload(): CalSlotsRequest {
    const timeZone = this.getUserTimezone();
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);

    return {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      timeZone,
      duration: environment.calDurationMinutes || this.defaultDurationMinutes,
      eventTypeSlug: environment.calEventTypeSlug || this.defaultEventTypeSlug,
      username: environment.calUsername || this.defaultUsername,
    };
  }

  private buildCreateBookingPayload(email: string, phoneNumber: string): CalBookingRequest {
    const lead = this.lastLeadData as LeadFormData;
    const selectedSlot = this.selectedSlot as CalSlot;

    return {
      start: selectedSlot.start,
      attendee: {
        name: lead.name,
        email,
        phoneNumber,
        timeZone: this.getUserTimezone(),
      },
      eventTypeSlug: environment.calEventTypeSlug || this.defaultEventTypeSlug,
      username: environment.calUsername || this.defaultUsername,
      leadId: this.buildLeadId(lead),
      metadata: {
        phone: lead.phone,
        drugstoreCount: lead.drugstoreCount,
        leadSource: 'landing_contact_form',
        ...this.getTrackingParams(),
      },
    };
  }

  private getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
  }

  private buildLeadId(lead: LeadFormData): string {
    const base = `${lead.phone}-${lead.name}`.toLowerCase().replace(/\s+/g, '-');
    return `${base}-${Date.now()}`;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private normalizePhoneNumberToE164(phone: string): string {
    const digits = `${phone || ''}`.replace(/\D/g, '');
    if (!digits) {
      return '';
    }
    const withCountryCode = digits.startsWith('55') ? digits : `55${digits}`;
    return `+${withCountryCode}`;
  }

  private formatPhoneWithBrazilCountryCode(phone: string): string {
    const digits = `${phone || ''}`.replace(/\D/g, '');
    if (!digits) {
      return '';
    }
    return digits.startsWith('55') ? digits.slice(2) : digits;
  }

  private getTrackingParams(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }

    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

    return keys.reduce<Record<string, string>>((acc, key) => {
      const value = params.get(key);
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  private sortSlots(slots: CalSlot[]): CalSlot[] {
    return [...slots].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  private groupSlotsByDay(slots: CalSlot[]): SlotDayGroup[] {
    const grouped = slots.reduce<Map<string, CalSlot[]>>((acc, slot) => {
      const date = new Date(slot.start);
      const timeZone = slot.timeZone || this.getUserTimezone();
      const dayKey = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone,
      }).format(date);
      const current = acc.get(dayKey) || [];
      current.push(slot);
      acc.set(dayKey, current);
      return acc;
    }, new Map<string, CalSlot[]>());

    return Array.from(grouped.entries()).map(([dayKey, daySlots]) => ({
      dayKey,
      label: this.formatDayLabel(daySlots[0]),
      slots: this.sortSlots(daySlots),
    }));
  }

  private formatDayLabel(slot: CalSlot): string {
    const date = new Date(slot.start);
    const timeZone = slot.timeZone || this.getUserTimezone();

    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      timeZone,
    }).format(date);
  }

  private extractApiErrorMessage(error: unknown, fallback: string): string {
    if (!error || typeof error !== 'object') {
      return fallback;
    }

    const maybeHttpError = error as { error?: CalApiError };
    if (maybeHttpError.error?.message) {
      return maybeHttpError.error.message;
    }

    return fallback;
  }

  private pushAnalyticsEvent(eventName: string, payload: Record<string, string>): void {
    if (typeof window === 'undefined') {
      return;
    }

    const analyticsPayload = { event: eventName, ...payload };
    const win = window as typeof window & {
      dataLayer?: Array<Record<string, string>>;
      gtag?: (command: string, eventName: string, params?: Record<string, string>) => void;
    };

    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push(analyticsPayload);
    }

    if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, payload);
    }
  }
}
