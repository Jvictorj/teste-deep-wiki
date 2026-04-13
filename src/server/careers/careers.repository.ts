import {
  CareerApplicationRecord,
  CreateCareerApplicationResult,
} from './careers.types';

export interface CareersRepository {
  saveApplication(
    application: CareerApplicationRecord
  ): Promise<CreateCareerApplicationResult>;
}

export function createCareersRepository(): CareersRepository {
  const storageMode = getStorageMode();

  if (storageMode === 'postgres') {
    return new PostgresReadyCareersRepository();
  }

  return new InMemoryCareersRepository();
}

class InMemoryCareersRepository implements CareersRepository {
  private static readonly applications: CareerApplicationRecord[] = [];

  async saveApplication(
    application: CareerApplicationRecord
  ): Promise<CreateCareerApplicationResult> {
    InMemoryCareersRepository.applications.push(application);

    return {
      id: application.id,
      createdAt: application.createdAt,
      storageMode: 'memory',
    };
  }
}

class PostgresReadyCareersRepository implements CareersRepository {
  async saveApplication(
    application: CareerApplicationRecord
  ): Promise<CreateCareerApplicationResult> {
    void application;

    if (!process.env['CAREERS_DATABASE_URL']) {
      throw new Error(
        'CAREERS_DATABASE_URL não configurado. A API de careers está pronta para Postgres, mas o adapter do banco ainda precisa ser conectado.'
      );
    }

    throw new Error(
      'Adapter Postgres pendente. Conecte esta API a um client do PostgreSQL e persista os campos da candidatura na tabela career_applications.'
    );
  }
}

function getStorageMode(): 'memory' | 'postgres' {
  return process.env['CAREERS_STORAGE_MODE'] === 'postgres'
    ? 'postgres'
    : 'memory';
}
