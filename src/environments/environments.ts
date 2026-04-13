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

    // Google Maps – keep the key out of source control in production;
    // override via a build-time replacement or CI variable.
    googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',

    // Allowed origins for server-side CORS
    allowedOrigins: [
        'https://zapfarma.com',
        'https://www.zapfarma.com',
        'http://localhost:4200',
        'http://localhost:4000',
    ],
}
