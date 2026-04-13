# PROJECT_DOCS.md — front-zapfarma

> Complete technical documentation for onboarding senior engineers.
> Generated from full codebase analysis, git history, and architectural inference.

---

## TL;DR — Quick Start

```bash
# 1. Clone
git clone https://github.com/Jvictorj/teste-deep-wiki.git
cd teste-deep-wiki

# 2. Install dependencies
npm install

# 3. Run dev server (client-side only)
npx nx serve front-zapfarma

# 4. Run SSR dev server
npx nx run front-zapfarma:serve-ssr

# 5. Lint
npx nx lint front-zapfarma

# 6. Unit tests
npx nx test front-zapfarma

# 7. Build for production
npx nx build front-zapfarma --configuration=production
```

**Key URLs (production)**:
- App: `https://zapfarma.com`
- API: `https://api-integrations.zapfarma.com`
- AI API: `https://api-ia.zapfarma.com/api`
- Onboarding API: `https://hom-apichat.zapfarma.com`

---

## 1. Project Overview

### What it is

**front-zapfarma** is the frontend application for **ZapFarma**, a Brazilian SaaS product that integrates artificial intelligence with pharmacy ERP systems to automate customer service and sales through WhatsApp.

### What problem it solves

Brazilian pharmacies (drogarias) lose sales because they can't respond to WhatsApp messages 24/7. ZapFarma provides an AI assistant that:
- Answers customer questions automatically via WhatsApp
- Processes medication orders integrated with the pharmacy's ERP
- Handles prescription analysis
- Manages delivery logistics

### Target users

1. **Pharmacy owners/managers** — configure AI, manage stores, view dashboards
2. **Sales representatives (representantes/afiliados)** — manage affiliated pharmacies
3. **End customers** — interact with the landing page, AI chat widget, and scheduling
4. **Job applicants** — submit career applications via the "Trabalhe Conosco" page

### What the project is NOT

- It is **not** the backend API — the backend lives at `api-integrations.zapfarma.com` (separate repo)
- It is **not** the AI engine — the AI service lives at `api-ia.zapfarma.com` (separate repo)
- It is **not** the WhatsApp message broker — that is handled by external infrastructure (Coex, Meta Cloud API)
- It does **not** contain the ERP integration logic — that's backend-side

---

## 2. Tech Stack

### Core

| Technology | Version | Purpose |
|---|---|---|
| **Angular** | 18.2.x | Frontend framework (standalone component API) |
| **TypeScript** | 5.5.x | Language |
| **Nx** | 19.7.0 | Monorepo tooling, build orchestration, caching |
| **Express** | 4.18.x | Server-Side Rendering (SSR) server |
| **Angular SSR** | 18.2.x | Server-side rendering engine (`CommonEngine`) |
| **SCSS** | — | Styling (inline style language for components) |

### UI / Design

| Library | Purpose |
|---|---|
| **Angular Material** (`@angular/material` 18.2.x) | UI component library (inputs, cards, icons, buttons) |
| **Angular CDK** | Low-level UI primitives |
| **Swiper** (9.4.x) | Carousel/slider components |
| **animate.css** / **ng-animate** | CSS animations |
| **ngx-skeleton-loader** | Loading skeleton placeholders |

### Forms & Validation

| Library | Purpose |
|---|---|
| **Angular Reactive Forms** | Form management across the app |
| **ngx-mask** | Input masking (phone, CPF, CNPJ) |
| **ngx-currency** / **ng2-currency-mask** | Currency input formatting (BRL) |
| **cnpj** | CNPJ validation |
| **gerador-validador-cpf** | CPF generation/validation |

### Integrations

| Library | Purpose |
|---|---|
| **@angular/google-maps** | Google Maps integration for store locator |
| **@aws-sdk/client-geo-places** | AWS Location Service for geolocation |
| **cep-distance** | CEP (postal code) distance calculation |

### DevDependencies

| Tool | Purpose |
|---|---|
| **Jest** (29.7.x) + **jest-preset-angular** | Unit testing |
| **Playwright** (1.36.x) | End-to-end testing |
| **ESLint** (8.57.x) + Angular ESLint plugins | Linting |
| **Prettier** (2.6.x) | Code formatting |
| **SWC** | Fast TypeScript compilation |

### Infrastructure (inferred)

- **Hosting**: Likely AWS-based (AWS SDK dependency, AWS branding assets)
- **Domain**: `zapfarma.com`
- **CDN/Deploy**: Not configured in repo (no CI/CD pipeline files present)
- **Database**: PostgreSQL (for careers module; schema in `docs/`)
- **Webhooks**: n8n (self-hosted workflow automation at `n8ndocker.Zapfarmafy.com.br`)

---

## 3. Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Browser (Client)                   │
│                                                      │
│  Angular 18 SPA (standalone components)              │
│  ├── Landing Page (public)                           │
│  ├── Auth Pages (login, register, password recovery) │
│  ├── Dashboard (authenticated)                       │
│  ├── Admin Pages (pharmacies, users, plans)          │
│  ├── AI Chat Widget (floating)                       │
│  └── AI Onboarding Configuration                     │
│                                                      │
│  HashLocationStrategy (#/ routing)                   │
└──────────────┬──────────────┬────────────────────────┘
               │              │
               │              │ SSR (server.ts / Express)
               │              │  └── /api/careers (REST)
               │              │
    ┌──────────▼──────────┐   │
    │  External APIs      │   │
    ├─────────────────────┤   │
    │ api-integrations    │◄──┘
    │  .zapfarma.com      │   Usuarios, Farmacias, Companies,
    │                     │   Contatos, CEPs, Cal.com proxy,
    │                     │   IA Config, WhatsApp Cloud API
    ├─────────────────────┤
    │ api-ia.zapfarma.com │   AI Chat (send message, clear session)
    ├─────────────────────┤
    │ hom-apichat         │   IA Configurações (onboarding)
    │  .zapfarma.com      │
    ├─────────────────────┤
    │ n8ndocker           │   Webhook (contact form → n8n)
    │  .Zapfarmafy.com.br │
    ├─────────────────────┤
    │ viacep.com.br       │   CEP lookup (public API)
    ├─────────────────────┤
    │ Google Maps API     │   Store locator map
    ├─────────────────────┤
    │ Cal.com             │   Demo scheduling
    └─────────────────────┘
```

### Patterns Used

- **Standalone Components** (Angular 18): No `NgModule` for new components. Legacy shared modules (`HeaderModule`, `FooterModule`) still exist for older components.
- **Service Layer**: Each domain has its own Angular service (`UsuariosService`, `FarmaciasService`, etc.) that encapsulates HTTP calls.
- **Route Guards**: Role-based access control via `CanActivate` guards (`UsuarioAutenticadoGuard`, `PerfilGerenciadorGuard`, etc.).
- **Functional HTTP Interceptor**: `authInterceptor` automatically attaches JWT Bearer tokens to all outgoing requests.
- **Theme System**: Light/dark mode via CSS custom properties + `ThemeService` toggling a `.dark` class on `<html>`.
- **SSR + Hydration**: Express server renders Angular pages server-side; client hydrates on load.
- **Repository Pattern** (server-side): `careers.repository.ts` abstracts storage (in-memory or Postgres).

### Data Flow (Request → Processing → Response)

1. **User interacts** with Angular component
2. **Component** calls an Angular **Service** (e.g., `UsuariosService.logar()`)
3. **Service** makes HTTP request via `HttpClient`
4. **Auth Interceptor** attaches JWT token from `sessionStorage`
5. **External API** processes request and returns response
6. **Service** transforms response (e.g., stores token in `sessionStorage`)
7. **Component** updates view based on response

---

## 4. Folder & Code Structure

```
/
├── docs/                          # Project documentation
│   ├── careers-postgres.sql       # SQL schema for career applications
│   ├── configuracao-ia.md         # IA configuration feature docs
│   ├── desing/                    # Brand guidelines (PDFs)
│   ├── gitflow.md                 # Git workflow documentation
│   ├── ia-configuracoes-table.sql # SQL schema for IA configurations
│   └── medicamentos-fotos.md      # Medication photos documentation
│
├── e2e/                           # End-to-end tests (Playwright)
│   ├── playwright.config.ts
│   └── src/example.spec.ts        # Placeholder e2e spec
│
├── medicamentos/                  # Medication data & photos (data assets)
│   ├── Lista-produtos-fotos.xlsx
│   └── fotos/
│
├── public/                        # Static public assets
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Root component (just <router-outlet>)
│   │   ├── app.config.ts          # Application config (providers, routing)
│   │   ├── app.config.server.ts   # SSR-specific config
│   │   ├── app.routes.ts          # All route definitions
│   │   │
│   │   ├── hooks/                 # Custom utility services
│   │   │   ├── mobile.service.ts  # Mobile device detection
│   │   │   └── toast.service.ts   # Toast notification system
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # JWT Bearer token injection
│   │   │
│   │   ├── landing/               # Landing page section components
│   │   │   ├── header/            # Landing page header/nav
│   │   │   ├── hero/              # Hero section with chat mockup
│   │   │   ├── about-section/
│   │   │   ├── calculator-section/ # ROI/savings calculator
│   │   │   ├── contact-section/
│   │   │   ├── cta-section/
│   │   │   ├── faq-section/
│   │   │   ├── features-section/
│   │   │   ├── footer/
│   │   │   ├── integration-section/
│   │   │   ├── partnerships-section/
│   │   │   ├── pricing-section/
│   │   │   ├── problem-section/
│   │   │   ├── politica-privacidade-zapfarma/
│   │   │   └── termos-uso-zapfarma/ (inferred)
│   │   │
│   │   ├── pages/                 # Route-level page components
│   │   │   ├── home/              # Landing page aggregator
│   │   │   ├── login/             # Authentication
│   │   │   ├── dashboard/         # Authenticated dashboard
│   │   │   ├── empresas/          # Pharmacy (company) management
│   │   │   │   ├── cadastro/      # Create pharmacy
│   │   │   │   ├── editar/        # Edit pharmacy
│   │   │   │   └── criacao-saas/  # SaaS company creation
│   │   │   ├── usuarios/          # User management
│   │   │   ├── configuracao-ia/   # AI configuration form
│   │   │   ├── configuracao-ia-lista/ # AI configurations list
│   │   │   ├── mensageria/        # Messaging
│   │   │   ├── planos/            # Plans/pricing (authenticated)
│   │   │   ├── maps/              # Store locator map
│   │   │   ├── treinamentos/      # Training materials
│   │   │   ├── trabalhe-conosco/  # Careers page
│   │   │   ├── contato-cliente/   # Customer contact
│   │   │   ├── whatsapp-cloud-api/ # WhatsApp Cloud API setup
│   │   │   ├── business-manager-meta/ # Meta Business Manager
│   │   │   ├── coex-api-oficial/  # Coex API integration
│   │   │   ├── criacao-drogaria/  # Pharmacy creation flow
│   │   │   ├── alterar-senha/     # Change password
│   │   │   ├── esqueceu-senha/    # Forgot password
│   │   │   ├── primeiro-acesso/   # First access setup
│   │   │   ├── novo-usuario/      # New user registration
│   │   │   ├── cadastro-afiliados/ # Affiliate registration
│   │   │   ├── area-logada/       # Authenticated area
│   │   │   └── sobre/             # About page
│   │   │
│   │   ├── services/              # Angular services (API layer)
│   │   │   ├── usuarios/          # User auth & management
│   │   │   ├── farmacias/         # Pharmacy CRUD
│   │   │   ├── companies/         # Company creation (SaaS)
│   │   │   ├── careers/           # Career applications
│   │   │   ├── ia-chat/           # AI chat API
│   │   │   ├── ia-configuracao/   # AI configuration API
│   │   │   ├── calcom/            # Cal.com scheduling
│   │   │   ├── ceps/              # CEP/address lookup
│   │   │   ├── contatos/          # Contact form
│   │   │   ├── users-saas/        # SaaS user creation
│   │   │   ├── webhook/           # n8n webhook
│   │   │   └── guards/            # Route guards
│   │   │
│   │   ├── shared/                # Shared components
│   │   │   ├── chat-ia-widget/    # Floating AI chat widget
│   │   │   ├── toolbar/           # App toolbar/navigation
│   │   │   ├── header/            # Shared header (NgModule-based)
│   │   │   ├── footer/            # Shared footer (NgModule-based)
│   │   │   └── menu/              # Menu component
│   │   │
│   │   ├── theme/                 # Theme system
│   │   │   ├── theme.service.ts   # Theme toggle logic
│   │   │   └── theme.provider.ts  # APP_INITIALIZER for theme
│   │   │
│   │   └── ui/                    # Reusable UI component library
│   │       ├── item/              # Item group/list components
│   │       ├── toast/             # Toast notification UI
│   │       ├── toaster/           # Toast container
│   │       ├── sidebar/           # Sidebar layout
│   │       ├── sheet/             # Bottom sheet / drawer
│   │       ├── tabs/              # Tab components
│   │       ├── table/             # Data table components
│   │       ├── select/            # Select dropdown
│   │       ├── pagination/        # Pagination controls
│   │       ├── popover/           # Popover component
│   │       ├── tooltip/           # Tooltip component
│   │       ├── toggle/            # Toggle switch
│   │       ├── slider/            # Range slider
│   │       ├── progress/          # Progress bar
│   │       ├── separator/         # Visual separator
│   │       ├── skeleton/          # Loading skeleton
│   │       ├── spinner/           # Loading spinner
│   │       ├── label/             # Form label
│   │       ├── textarea/          # Textarea input
│   │       ├── switch/            # Switch toggle
│   │       ├── radio-group/       # Radio button group
│   │       ├── scroll-area/       # Custom scroll area
│   │       ├── navigation-menu/   # Navigation menu
│   │       ├── menubar/           # Menu bar
│   │       ├── kbd/               # Keyboard shortcut display
│   │       ├── resizable/         # Resizable panels
│   │       ├── toggle-group/      # Toggle button group
│   │       └── theme-icon/        # Theme toggle icon
│   │
│   ├── server/                    # Server-side modules (used by SSR)
│   │   └── careers/               # Career applications API
│   │       ├── careers.routes.ts  # Express router
│   │       ├── careers.repository.ts # Storage abstraction
│   │       ├── careers.types.ts   # TypeScript types
│   │       └── careers.validation.ts # Payload validation
│   │
│   ├── environments/
│   │   └── environments.ts        # API URLs and config
│   │
│   ├── style/
│   │   └── tokens.scss            # Design tokens
│   │
│   ├── styles.scss                # Global styles (theme vars, dark mode)
│   ├── index.html                 # Entry HTML (SEO meta, Google Maps script)
│   ├── main.ts                    # Client bootstrap
│   └── main.server.ts             # Server bootstrap
│
├── server.ts                      # Express SSR entry point
├── package.json                   # Dependencies & scripts
├── nx.json                        # Nx workspace configuration
├── project.json                   # Nx project targets
├── tsconfig.json                  # Root TypeScript config
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.server.json           # Server TS config
├── tsconfig.spec.json             # Test TS config
├── jest.config.ts                 # Jest configuration
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                    # Prettier configuration
└── .prettierignore                # Prettier ignore patterns
```

---

## 5. Coding Standards & Conventions

### Naming Conventions

- **Components**: kebab-case selectors prefixed with `front-zapfarma-` (e.g., `front-zapfarma-toolbar`)
- **Directives**: camelCase prefixed with `frontZapFarma` (ESLint-enforced)
- **Files**: kebab-case (e.g., `usuario-autenticado.gard.ts`)
- **Services**: PascalCase class names (e.g., `UsuariosService`)
- **Guards**: Named `*.gard.ts` (non-standard — typo in "guard", but consistent)
- **Language**: Portuguese for business logic naming (method names, variables), English for Angular/technical patterns

### Component Pattern

All new components use **Angular standalone API** (no `NgModule`):

```typescript
@Component({
  selector: 'front-zapfarma-example',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent {}
```

### Authentication Pattern

- JWT tokens stored in `sessionStorage` (key: `'token'`)
- User object stored as base64-encoded JSON in `sessionStorage` (key: `'usuario'`)
- Multiple fallback strategies to extract tokens (legacy compatibility)
- Passwords encoded with `btoa()` before sending to API

### Error Handling Style

- Services use RxJS `catchError` / `throwError` for HTTP errors
- Components show user-friendly error messages in Portuguese
- No centralized error handling — each component handles errors locally

### Testing Approach

- **Unit tests**: Jest with `jest-preset-angular`. Spec files colocated with components (`.spec.ts`)
- **E2E tests**: Playwright configured but only has a placeholder spec
- Test coverage is minimal — most spec files are scaffolded but not substantially written

---

## 6. Git & Development Workflow

### Current State

The repository has a single meaningful commit on `main`:
- `6109063` — `first commit` (initial codebase dump)

Four feature branches exist from automated Devin sessions:
- `devin/1776051736-security-fixes`
- `devin/1776051651-security-fixes`
- `devin/1776051588-add-env-example`
- `devin/1776051592-improve-gitignore`

### Documented Branching Strategy

The team has documented a **Git Flow** strategy in `docs/gitflow.md`:

- `main` → production
- `develop` → integration (not yet present in repo)
- `feature/...` → feature branches from `develop`
- `release/...` → release preparation
- `hotfix/...` → urgent production fixes

**Recommended commit format**: `feat(scope): description in pt-br`

Examples:
```
feat(hero): adiciona novas demonstracoes no chat
fix(hero): ajusta autoscroll do mockup
docs(brand): adiciona materiais de referencia
```

### Integration strategy

- Use `rebase` to update feature branches with `develop`
- Use `merge --no-ff` to integrate features into `develop`
- Tag releases on `main` (e.g., `v1.0.0`)

### Current Reality vs. Documentation

The documented Git Flow is aspirational — the repo currently has only a single commit on `main` with no `develop` branch. The team should establish this workflow as development scales.

---

## 7. Environment & Setup

### Prerequisites

- **Node.js** >= 18 (for Angular 18 compatibility)
- **npm** (lockfile is `package-lock.json`)

### Environment Variables

The app uses a hardcoded `src/environments/environments.ts` file (no `.env` files):

| Variable | Value | Purpose |
|---|---|---|
| `apiOnboarding` | `https://hom-apichat.zapfarma.com` | AI onboarding API |
| `apiProd` | `https://api-integrations.zapfarma.com` | Main backend API |
| `apiIa` | `https://api-ia.zapfarma.com/api` | AI chat API |
| `calDemoBaseUrl` | `https://cal.com/zapfarma/45min` | Cal.com demo scheduling |
| `careersApiUrl` | `http://127.0.0.1:4000/api/careers` | Careers API (local SSR) |
| `urlWebHookProd` | `https://n8ndocker.Zapfarmafy.com.br/webhook/experiencia` | n8n webhook |

**Server-side environment variables** (for careers module):
- `CAREERS_STORAGE_MODE` — `'memory'` (default) or `'postgres'`
- `CAREERS_DATABASE_URL` — PostgreSQL connection string (required if mode is `postgres`)
- `PORT` — Express server port (default: `4000`)

### Build & Run Steps

```bash
# Development (client-only)
npx nx serve front-zapfarma          # http://localhost:4200

# Development (SSR)
npx nx run front-zapfarma:serve-ssr  # http://localhost:4200 (SSR)

# Production build
npx nx build front-zapfarma --configuration=production
# Output: dist/front-zapfarma/

# SSR production build
npx nx run front-zapfarma:server --configuration=production
# Output: dist/front-zapfarma/server/

# Run production SSR server
node dist/front-zapfarma/server/main.js
```

---

## 8. Key Features

### 8.1 Landing Page (Public)

The home page (`/`) is a full marketing landing page composed of 13+ standalone sections:

- **Header**: Navigation bar with logo, links, and CTA
- **Hero**: Animated WhatsApp chat mockup demonstrating AI responses
- **Problem Section**: Pain points pharmacies face
- **Steps Section**: How ZapFarma works
- **Results Section**: Metrics and outcomes
- **Testimonials Section**: Customer testimonials
- **Calculator Section**: ROI calculator for pharmacies
- **Partnerships Section**: Partner logos (ERP integrations)
- **Features Section**: Feature highlights
- **Integration Section**: Technical integration showcase
- **Pricing Section**: Plan comparison
- **FAQ Section**: Frequently asked questions
- **CTA Section**: Call to action
- **Contact Section**: Contact form
- **Footer**: Links, legal, social

### 8.2 AI Chat Widget

A floating chat widget (`ChatIaWidgetComponent`) available on the landing page:
- Communicates with `api-ia.zapfarma.com/api/chat`
- Maintains session state via `sessionId`
- Parses markdown-like responses (bold, links, headings)
- Can be triggered automatically via `/assistente-ia` route
- Supports conversation reset (clears remote session)

### 8.3 Authentication & User Management

- **Login**: Email/CPF + password authentication via `UsuariosService.logar()`
- **Session**: JWT stored in `sessionStorage`, user object base64-encoded
- **Roles**: `gerenciador` (manager), `comercial` (sales), `representante` (representative)
- **Guards**: Route protection based on authentication state and role
- **Password Recovery**: Email-based flow via `esqueceu-senha` → `alterar-senha`

### 8.4 Pharmacy (Drogaria) Management

- CRUD operations for pharmacies via `FarmaciasService`
- Affiliated pharmacies per representative
- CNPJ-based lookup
- Company creation (SaaS onboarding flow via `CompaniesService`)

### 8.5 AI Configuration Onboarding

A comprehensive form (`ConfiguracaoIaComponent`) for pharmacies to configure their AI assistant:
- Corporate data (name, CNPJ, segment)
- Operational details (service hours, delivery, payment methods)
- AI strategy (tone of voice, keywords, knowledge base)
- LGPD consent
- Posts to `hom-apichat.zapfarma.com/ia-configuracoes`

### 8.6 Careers / Talent Bank

- Full-stack feature: frontend form (`TrabalheConoscoComponent`) + SSR API (`/api/careers`)
- Resume upload (PDF/DOCX, max 5MB, base64-encoded)
- Server-side validation with typed error handling
- Storage: in-memory (default) or PostgreSQL (configurable)
- LGPD consent required

### 8.7 Demo Scheduling (Cal.com)

- Integration with Cal.com via proxy API (`CalcomService`)
- Lists available time slots
- Creates booking with attendee info
- 45-minute demo sessions

### 8.8 Google Maps Store Locator

- Interactive map showing pharmacy locations
- Uses `@angular/google-maps` + Google Maps JavaScript API
- AWS Geo Places SDK for additional geolocation features

### 8.9 Theme System (Light/Dark Mode)

- CSS custom properties in `:root` and `.dark` selectors
- `ThemeService` manages toggle, persists to `localStorage`
- Initialized via `APP_INITIALIZER` on app startup
- Full dark mode support across all landing page sections

---

## 9. External Integrations

| Integration | Endpoint / Service | Usage |
|---|---|---|
| **ZapFarma API** | `api-integrations.zapfarma.com` | Core backend: users, pharmacies, companies, contacts, CEPs, Cal.com proxy, WhatsApp Cloud API |
| **ZapFarma AI API** | `api-ia.zapfarma.com/api` | AI chat: send messages, manage sessions |
| **Onboarding API** | `hom-apichat.zapfarma.com` | AI configuration: save/list IA configurations |
| **n8n Webhooks** | `n8ndocker.Zapfarmafy.com.br/webhook/experiencia` | Contact form submissions → workflow automation |
| **Google Maps** | Maps JavaScript API | Store locator map rendering |
| **AWS Geo Places** | `@aws-sdk/client-geo-places` | Geolocation/address services |
| **Cal.com** | Proxied via `apiProd/cal/...` | Demo scheduling (slots + bookings) |
| **ViaCEP** | `viacep.com.br/ws/{cep}/json/` | Brazilian postal code lookup (public) |
| **Meta Business** | Page: `business-manager-meta` | Meta Business Manager setup guide |
| **WhatsApp Cloud API** | Page: `whatsapp-cloud-api` | WhatsApp API configuration |
| **Coex API** | Page: `coex-api-oficial` | Coex official API integration |

---

## 10. Database

### Career Applications (`career_applications`)

**Schema** (from `docs/careers-postgres.sql`):

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` PK | Generated as `career_{timestamp}_{random}` |
| `first_name` | `TEXT` | |
| `last_name` | `TEXT` | |
| `email` | `TEXT` | Indexed |
| `phone` | `TEXT` | Digits only |
| `city` | `TEXT` | |
| `state` | `TEXT` | |
| `linkedin_url` | `TEXT` | |
| `portfolio_url` | `TEXT` | Optional |
| `interest_area` | `TEXT` | Indexed |
| `vacancy_id` | `TEXT` | |
| `vacancy_title` | `TEXT` | |
| `experience_level` | `TEXT` | |
| `message` | `TEXT` | |
| `consent_lgpd` | `BOOLEAN` | Required `true` |
| `resume_file_name` | `TEXT` | |
| `resume_mime_type` | `TEXT` | PDF or DOCX only |
| `resume_size_bytes` | `INTEGER` | Max 5MB |
| `resume_base64_content` | `TEXT` | Full file content |
| `submitted_at` | `TIMESTAMPTZ` | |
| `created_at` | `TIMESTAMPTZ` | Indexed (desc) |

### AI Configurations (`ia_configuracoes`)

**Schema** (from `docs/ia-configuracoes-table.sql`):

| Column | Type | Notes |
|---|---|---|
| `id` | `SERIAL` PK | |
| `empresa` | `VARCHAR(255)` | Company name |
| `nome_ia` | `VARCHAR(255)` | AI assistant name |
| `cnpj` | `VARCHAR(20)` | |
| `segmento` | `VARCHAR(255)` | Business segment |
| 27+ additional fields | Various | See full schema in `docs/ia-configuracoes-table.sql` |
| `consentimento_lgpd` | `BOOLEAN` | Required |
| `created_at` | `TIMESTAMPTZ` | |

### Data Flow

1. **Careers**: Form → `CareersService` (client) → `POST /api/careers/applications` → `careers.validation.ts` → `careers.repository.ts` → Memory/PostgreSQL
2. **AI Config**: Form → `IaConfiguracaoService` (client) → `POST hom-apichat.zapfarma.com/ia-configuracoes` → External backend

---

## 11. Known Issues / Technical Debt

### Critical

1. **Exposed Google Maps API key** in `src/index.html` — the API key `AIzaSyCMPH12qX5NCYkD7J_yUcPqWcj2vkRz4qk` is hardcoded and committed. Should be restricted by domain and moved to environment config.

2. **Passwords encoded with `btoa()`, not hashed** — `UsuariosService` and `FarmaciasService` use `btoa(senha)` before sending to API. This is base64 encoding (reversible), not hashing. The backend must handle actual hashing, but this approach exposes passwords in any network logs that capture request bodies.

3. **Resume stored as base64 in database** — Career applications store the entire resume file as base64 text in the database (`resume_base64_content`). This creates very large rows and will scale poorly. Should use object storage (S3).

### High

4. **Duplicated token extraction logic** — Token reading/parsing is copy-pasted across `auth.interceptor.ts`, `UsuariosService`, and `FarmaciasService` with slight variations. Should be extracted to a single utility.

5. **Inconsistent service patterns** — Some services use `@Injectable()` (requiring explicit `providers`), others use `@Injectable({ providedIn: 'root' })`. This causes confusion about injection scope.

6. **No environment separation** — Single `environments.ts` file with production URLs. No `environment.development.ts` or environment-based switching. The `apiOnboarding` URL points to `hom-` (homologation/staging).

7. **No CI/CD pipeline** — `nx.json` references `.github/workflows/ci.yml` in shared globals, but no CI workflow file exists in the repository.

### Medium

8. **Legacy NgModule coexistence** — `HeaderModule`, `FooterModule` still use `NgModule` pattern alongside standalone components.

9. **Guard file naming** — Guards use `.gard.ts` extension (typo of "guard"), which is inconsistent with Angular conventions.

10. **Sparse test coverage** — Most `.spec.ts` files contain only scaffolded tests. The e2e suite has a single placeholder test.

11. **CORS headers set client-side** — Multiple services set `Access-Control-Allow-*` headers in client requests. These headers are meaningless on client requests — CORS is a server-side concern.

12. **Unused imports and commented code** — Several files have commented-out imports (e.g., `// import { Usuarios }`) and dead code.

13. **Duplicate route definitions** — `app.routes.ts` has two route arrays (`appRoutes` and `routes`) with overlapping definitions. Only `appRoutes` is used in `app.config.ts`.

---

## 12. Security Considerations

### Vulnerabilities

| Issue | Severity | Description |
|---|---|---|
| **Exposed API key** | HIGH | Google Maps API key is in `index.html`. Should be restricted by HTTP referrer. |
| **Base64 password "encoding"** | MEDIUM | `btoa()` is not encryption. If backend doesn't hash, passwords are at risk. |
| **Token in sessionStorage** | MEDIUM | Vulnerable to XSS. Consider `httpOnly` cookies for token storage. |
| **No CSRF protection** | MEDIUM | API calls use Bearer tokens (CSRF-resistant), but no explicit CSRF tokens. |
| **Wildcard CORS on careers API** | LOW | `Access-Control-Allow-Origin: *` on `/api/careers` — acceptable for a public form, but should be scoped in production. |

### Secrets Handling

- No `.env` file in repo (good)
- API URLs hardcoded in `environments.ts` (not secrets, but should be environment-specific)
- No secrets manager integration
- `sessionStorage` is used for auth state (cleared on tab close)

### Auth Architecture

- JWT Bearer token authentication
- Complex fallback chain for legacy token formats (base64-wrapped, nested in user object)
- Role-based authorization via route guards
- Session cleared entirely on logout (`sessionStorage.clear()`)

---

## 13. Improvement Suggestions

### Architecture

1. **Create `environment.development.ts`** — Separate dev and prod environment configs. Use Angular's `fileReplacements` build option.

2. **Extract shared auth utility** — Create a single `TokenService` to centralize token extraction logic used in the interceptor, `UsuariosService`, and `FarmaciasService`.

3. **Migrate to signals** — Angular 18 supports signals. Gradually migrate `BehaviorSubject` patterns (e.g., `ToastService`) to signals for better performance.

4. **Implement lazy loading** — All routes are eagerly loaded. Use `loadComponent` for authenticated routes to reduce initial bundle size.

### Performance

5. **Lazy-load heavy modules** — Google Maps, Swiper, and the AI chat widget should be loaded on demand.

6. **Move resumes to object storage** — Replace base64 database storage with S3/R2 upload + URL reference.

7. **Add image optimization** — Many assets are PNG/JPEG. Convert to WebP, add `srcset` for responsive images.

### Developer Experience

8. **Set up CI/CD** — Create `.github/workflows/ci.yml` with lint, test, and build steps. Add deployment pipeline.

9. **Standardize to `providedIn: 'root'`** — Migrate all services to tree-shakable providers.

10. **Add Storybook** — The `ui/` component library is substantial. Storybook would help document and test components in isolation.

11. **Complete the `develop` branch** — Establish the Git Flow documented in `docs/gitflow.md` by creating the `develop` branch.

### Security

12. **Restrict Google Maps API key** — Add HTTP referrer restrictions in Google Cloud Console.

13. **Move to `httpOnly` cookies** — Replace `sessionStorage` token with `httpOnly` cookie set by backend.

14. **Add rate limiting** — The careers API has no rate limiting. Add express-rate-limit to prevent abuse.

---

## 14. How to Contribute

### Getting Started

1. Clone the repository and install dependencies (see TL;DR above)
2. Read `docs/gitflow.md` for the branching strategy
3. Create your branch from `develop` (once established) or `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

### Development Workflow

1. **Create a feature branch**: `git checkout -b feature/nome-da-feature`
2. **Develop**: Follow standalone component patterns, use Portuguese for business logic naming
3. **Lint**: `npx nx lint front-zapfarma`
4. **Test**: `npx nx test front-zapfarma`
5. **Commit**: Follow conventional commits in Portuguese:
   ```
   feat(scope): descricao da mudanca
   fix(scope): correcao do problema
   docs(scope): atualizacao de documentacao
   ```
6. **Push**: `git push -u origin feature/nome-da-feature`
7. **Open a PR** targeting `develop` (or `main` until `develop` is established)

### Best Practices

- **Always use standalone components** — Do not create new `NgModule`s
- **Follow the selector prefix** — Components: `front-zapfarma-*`, Directives: `frontZapFarma*`
- **Use `providedIn: 'root'`** for new services
- **Write in Portuguese** for user-facing strings and business logic names
- **Test your changes** with `npx nx lint` and `npx nx test` before pushing
- **Do not modify** the global styles (`styles.scss`) theme variables without team discussion
- **Do not commit** API keys, tokens, or secrets
- **Add SQL schemas** to `docs/` for any new database tables
- **Document new features** in `docs/` with a markdown file

### Folder Conventions

| What you're creating | Where to put it |
|---|---|
| New page | `src/app/pages/{page-name}/` |
| New landing section | `src/app/landing/{section-name}/` |
| New service | `src/app/services/{domain}/` |
| New reusable UI component | `src/app/ui/{component-name}/` |
| New shared component | `src/app/shared/{component-name}/` |
| New guard | `src/app/services/guards/` |
| SQL schemas | `docs/` |
| Design assets | `docs/desing/` |
