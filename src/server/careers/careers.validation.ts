import {
  CareerApplicationRecord,
  CareerApplicationRequest,
} from './careers.types';

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export class CareerApplicationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CareerApplicationValidationError';
  }
}

export function validateCareerApplicationPayload(
  payload: unknown
): CareerApplicationRecord {
  if (!payload || typeof payload !== 'object') {
    throw new CareerApplicationValidationError('Payload da candidatura inválido.');
  }

  const candidate = payload as Partial<CareerApplicationRequest>;
  const firstName = requireString(candidate.firstName, 'firstName');
  const lastName = requireString(candidate.lastName, 'lastName');
  const email = requireString(candidate.email, 'email').toLowerCase();
  const phone = requireString(candidate.phone, 'phone');
  const city = requireString(candidate.city, 'city');
  const state = requireString(candidate.state, 'state');
  const linkedinUrl = requireString(candidate.linkedinUrl, 'linkedinUrl');
  const interestArea = requireString(candidate.interestArea, 'interestArea');
  const interestAreaLabel = requireString(
    candidate.interestAreaLabel,
    'interestAreaLabel'
  );
  const experienceLevel = requireString(
    candidate.experienceLevel,
    'experienceLevel'
  );
  const experienceLevelLabel = requireString(
    candidate.experienceLevelLabel,
    'experienceLevelLabel'
  );
  const message = requireString(candidate.message, 'message');

  if (!isValidEmail(email)) {
    throw new CareerApplicationValidationError('Email da candidatura inválido.');
  }

  if (!isValidUrl(linkedinUrl)) {
    throw new CareerApplicationValidationError(
      'LinkedIn da candidatura inválido.'
    );
  }

  const portfolioUrl = optionalString(candidate.portfolioUrl);
  if (portfolioUrl && !isValidUrl(portfolioUrl)) {
    throw new CareerApplicationValidationError(
      'Portfólio da candidatura inválido.'
    );
  }

  if (candidate.consentLgpd !== true) {
    throw new CareerApplicationValidationError(
      'Consentimento LGPD é obrigatório.'
    );
  }

  const resume = validateResume(candidate.resume);
  const now = new Date().toISOString();

  return {
    id: createApplicationId(),
    firstName,
    lastName,
    email,
    phone: normalizePhone(phone),
    city,
    state,
    linkedinUrl: normalizeUrl(linkedinUrl),
    portfolioUrl: portfolioUrl ? normalizeUrl(portfolioUrl) : '',
    interestArea,
    interestAreaLabel,
    vacancyId: optionalString(candidate.vacancyId),
    vacancyTitle: optionalString(candidate.vacancyTitle),
    experienceLevel,
    experienceLevelLabel,
    message,
    consentLgpd: true,
    pageUrl: optionalString(candidate.pageUrl),
    submittedAt: optionalString(candidate.submittedAt) || now,
    resumeFileName: resume.fileName,
    resumeMimeType: resume.mimeType,
    resumeSizeBytes: resume.sizeBytes,
    resumeBase64Content: resume.base64Content,
    createdAt: now,
  };
}

function validateResume(
  resume: CareerApplicationRequest['resume'] | undefined
): CareerApplicationRequest['resume'] {
  if (!resume || typeof resume !== 'object') {
    throw new CareerApplicationValidationError(
      'Currículo da candidatura é obrigatório.'
    );
  }

  const fileName = requireString(resume.fileName, 'resume.fileName');
  const mimeType = requireString(resume.mimeType, 'resume.mimeType');
  const base64Content = requireString(
    resume.base64Content,
    'resume.base64Content'
  );
  const sizeBytes = Number(resume.sizeBytes);

  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    throw new CareerApplicationValidationError(
      'Tamanho do currículo inválido.'
    );
  }

  if (sizeBytes > MAX_RESUME_SIZE_BYTES) {
    throw new CareerApplicationValidationError(
      'O currículo excede o limite de 5 MB.'
    );
  }

  if (!ALLOWED_RESUME_TYPES.has(mimeType)) {
    throw new CareerApplicationValidationError(
      'Formato de currículo não suportado.'
    );
  }

  return {
    fileName,
    mimeType,
    sizeBytes,
    base64Content,
  };
}

function requireString(value: unknown, fieldName: string): string {
  const normalized = `${value ?? ''}`.trim();
  if (!normalized) {
    throw new CareerApplicationValidationError(
      `Campo obrigatório ausente: ${fieldName}.`
    );
  }

  return normalized;
}

function optionalString(value: unknown): string {
  return `${value ?? ''}`.trim();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function normalizeUrl(value: string): string {
  return value.match(/^https?:\/\//i) ? value : `https://${value}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(value: string): boolean {
  try {
    new URL(normalizeUrl(value));
    return true;
  } catch {
    return false;
  }
}

function createApplicationId(): string {
  return `career_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
