import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environments';

export type CareerApplicationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  interestArea: string;
  interestAreaLabel: string;
  vacancyId?: string;
  vacancyTitle?: string;
  experienceLevel: string;
  experienceLevelLabel: string;
  message: string;
  consentLgpd: boolean;
  submittedAt: string;
  pageUrl?: string;
  resumeFile: File;
};

type CareerApplicationApiRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedinUrl: string;
  portfolioUrl: string;
  interestArea: string;
  interestAreaLabel: string;
  vacancyId: string;
  vacancyTitle: string;
  experienceLevel: string;
  experienceLevelLabel: string;
  message: string;
  consentLgpd: boolean;
  submittedAt: string;
  pageUrl: string;
  resume: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    base64Content: string;
  };
};

@Injectable({ providedIn: 'root' })
export class CareersService {
  constructor(private readonly http: HttpClient) {}

  submitApplication(payload: CareerApplicationPayload): Observable<unknown> {
    return from(this.buildApiRequest(payload)).pipe(
      switchMap((requestBody) =>
        this.http.post(`${this.getApiUrl()}/applications`, requestBody)
      )
    );
  }

  private async buildApiRequest(
    payload: CareerApplicationPayload
  ): Promise<CareerApplicationApiRequest> {
    const resumeBase64 = await this.convertFileToBase64(payload.resumeFile);

    return {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      state: payload.state,
      linkedinUrl: payload.linkedinUrl,
      portfolioUrl: payload.portfolioUrl || '',
      interestArea: payload.interestArea,
      interestAreaLabel: payload.interestAreaLabel,
      vacancyId: payload.vacancyId || '',
      vacancyTitle: payload.vacancyTitle || '',
      experienceLevel: payload.experienceLevel,
      experienceLevelLabel: payload.experienceLevelLabel,
      message: payload.message,
      consentLgpd: payload.consentLgpd,
      submittedAt: payload.submittedAt,
      pageUrl: payload.pageUrl || '',
      resume: {
        fileName: payload.resumeFile.name,
        mimeType: payload.resumeFile.type,
        sizeBytes: payload.resumeFile.size,
        base64Content: resumeBase64,
      },
    };
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = `${reader.result ?? ''}`;
        const [, base64Content = ''] = result.split(',');
        resolve(base64Content);
      };

      reader.onerror = () => {
        reject(new Error('Não foi possível ler o currículo para envio.'));
      };

      reader.readAsDataURL(file);
    });
  }

  private getApiUrl(): string {
    return environment.careersApiUrl;
  }
}
