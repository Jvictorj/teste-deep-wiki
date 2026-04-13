import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface CalSlot {
  start: string;
  end: string;
  timeZone?: string;
}

export interface CalSlotsRequest {
  startTime: string;
  endTime: string;
  timeZone: string;
  duration: number;
  eventTypeSlug?: string;
  username?: string;
  usernames?: string[];
}

export interface CalSlotsResponse {
  slots: CalSlot[];
}

export interface CalBookingRequest {
  start: string;
  attendee: {
    name: string;
    email: string;
    phoneNumber?: string;
    timeZone: string;
  };
  eventTypeSlug?: string;
  username?: string;
  metadata?: Record<string, string>;
  leadId?: string;
}

export interface CalApiError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalcomService {
  private readonly baseUrl = environment.apiProd;

  constructor(private readonly httpClient: HttpClient) {}

  listSlots(payload: CalSlotsRequest): Observable<CalSlotsResponse> {
    return this.httpClient.post<unknown>(`${this.baseUrl}/cal/slots`, payload).pipe(
      map((response) => this.normalizeSlotsResponse(response))
    );
  }

  createBooking(payload: CalBookingRequest): Observable<unknown> {
    return this.httpClient.post(`${this.baseUrl}/cal/bookings`, payload);
  }

  private normalizeSlotsResponse(response: unknown): CalSlotsResponse {
    if (this.isObject(response) && Array.isArray(response['slots'])) {
      return { slots: response['slots'].filter((slot) => this.isSlot(slot)) as CalSlot[] };
    }

    if (Array.isArray(response)) {
      return { slots: response.filter((slot) => this.isSlot(slot)) as CalSlot[] };
    }

    return { slots: [] };
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isSlot(value: unknown): value is CalSlot {
    if (!this.isObject(value)) {
      return false;
    }
    return typeof value['start'] === 'string' && typeof value['end'] === 'string';
  }
}
