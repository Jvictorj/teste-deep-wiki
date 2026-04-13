import { Router } from 'express';
import { createCareersRepository } from './careers.repository';
import {
  CareerApplicationValidationError,
  validateCareerApplicationPayload,
} from './careers.validation';

export function createCareersRouter(): Router {
  const router = Router();
  const repository = createCareersRepository();

  router.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      service: 'careers-api',
      storageMode:
        process.env['CAREERS_STORAGE_MODE'] === 'postgres'
          ? 'postgres'
          : 'memory',
      expectsPostgres: true,
    });
  });

  router.post('/applications', async (req, res) => {
    try {
      const application = validateCareerApplicationPayload(req.body);
      const result = await repository.saveApplication(application);

      res.status(201).json({
        success: true,
        id: result.id,
        createdAt: result.createdAt,
        storageMode: result.storageMode,
      });
    } catch (error) {
      if (error instanceof CareerApplicationValidationError) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      // Never expose raw error details to the client.
      res.status(500).json({
        success: false,
        message: 'Erro interno ao processar candidatura.',
      });
    }
  });

  return router;
}
