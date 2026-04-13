/**
 * Angular compile-time environment configuration.
 *
 * These values are baked into the bundle at build time.
 * For server-side environment variables (PORT, CAREERS_STORAGE_MODE, etc.)
 * see the .env.example file in the project root.
 *
 * To override these values per deployment target, use Angular's
 * file-replacement feature in project.json / angular.json.
 */
export const environment = {
    apiOnboarding: 'https://hom-apichat.zapfarma.com',
    apiProd: 'https://api-integrations.zapfarma.com',
    apiIa: 'https://api-ia.zapfarma.com/api',

    //Agendamento
    calUseApiScheduling: true,
    calDemoBaseUrl: 'https://cal.com/zapfarma/45min',
    calEventTypeSlug: '45min',
    calUsername: 'zapfarma',
    calDurationMinutes: 45,

    // apiHotmart: 'https://api.Zapfarmafy.com.br',
    localhost: 'http://127.0.0.1:4000',
    urlWebHookTest: 'https://n8ndocker.Zapfarmafy.com.br/webhook-test/experiencia',
    urlWebHookProd: 'https://n8ndocker.Zapfarmafy.com.br/webhook/experiencia',

    //Banco de Talentos
    careersApiUrl: 'http://127.0.0.1:4000/api/careers',
    careersRecipientEmail: 'contato@zapfarma.com',
}
