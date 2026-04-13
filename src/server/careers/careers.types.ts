export type CareerApplicationResumeInput = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  base64Content: string;
};

export type CareerApplicationRequest = {
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
  pageUrl?: string;
  submittedAt?: string;
  resume: CareerApplicationResumeInput;
};

export type CareerApplicationRecord = {
  id: string;
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
  pageUrl: string;
  submittedAt: string;
  resumeFileName: string;
  resumeMimeType: string;
  resumeSizeBytes: number;
  resumeBase64Content: string;
  createdAt: string;
};

export type CreateCareerApplicationResult = {
  id: string;
  createdAt: string;
  storageMode: 'memory' | 'postgres';
};
