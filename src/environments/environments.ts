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

    // Google Maps — load from env variable at build time; fallback kept for dev.
    googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',

    // Allowed origins for server-side CORS (comma-separated in production env).
    allowedOrigins: 'https://zapfarma.com,https://www.zapfarma.com',
}
