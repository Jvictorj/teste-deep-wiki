# codex.md — AI Agent Guidelines for front-zapfarma

> This file is the single source of truth for AI agents working on this codebase.
> Read this **before** making any changes.

---

## Project Context

**front-zapfarma** is the Angular 18 frontend for **ZapFarma**, a Brazilian SaaS that integrates AI with pharmacy ERPs to automate WhatsApp-based customer service and sales.

### Boundaries

- **This repo** = Angular frontend + Express SSR server (careers API only)
- **Backend API** = separate repo at `api-integrations.zapfarma.com`
- **AI Engine** = separate repo at `api-ia.zapfarma.com`
- **Language**: Portuguese (pt-BR) for all user-facing text and business logic naming
- **Framework**: Angular 18 with standalone components (no NgModules for new code)
- **Build system**: Nx 19.7 monorepo

### Key API Endpoints (do not change these URLs)

```typescript
apiOnboarding: 'https://hom-apichat.zapfarma.com'
apiProd: 'https://api-integrations.zapfarma.com'
apiIa: 'https://api-ia.zapfarma.com/api'
```

---

## Rules the AI MUST Follow

### NEVER Change

1. **`src/environments/environments.ts`** — Do not modify API URLs or endpoint configurations without explicit instruction. These are production endpoints.

2. **Authentication flow** — The token storage strategy (`sessionStorage` with keys `'token'` and `'usuario'`) is used across the entire app. Do not change how tokens are stored or retrieved without refactoring all consumers.

3. **Route guard logic** — `UsuarioAutenticadoGuard`, `PerfilGerenciadorGuard`, `PerfilDrogariasGuard`, `PerfilUsuariosGuard` control access to protected pages. Do not weaken or remove guards.

4. **`app.routes.ts` route paths** — Existing route paths are referenced by the backend, external links, and SEO. Do not rename paths.

5. **LGPD consent fields** — `consentimentoLgpd` / `consentLgpd` fields are legally required. Never remove or default them to `true`.

6. **Component selector prefixes** — Components: `front-zapfarma-*` (kebab-case), Directives: `frontZapFarma*` (camelCase). ESLint enforces this.

7. **Global theme CSS variables** in `src/styles.scss` — The `:root` and `.dark` blocks define the design system. Changes here affect every component.

8. **`server.ts` Express configuration** — The SSR server, CORS config for `/api/careers`, and static file serving are production-critical.

### Critical Business Logic to Preserve

1. **Password encoding**: Passwords are encoded with `btoa()` before sending to the API. The backend expects this format. Do not change to raw passwords or hashing on the client side.

2. **Token extraction chain**: The `auth.interceptor.ts` and `UsuariosService` have multiple fallback strategies for reading tokens (plain JWT → base64-wrapped → user object nested). This supports legacy auth formats. Do not simplify without verifying all backends.

3. **Role-based routing**: After login, `LoginComponent.dashboard()` routes users based on their profile:
   - `gerenciador` / admin → `/dashboard`
   - Users with user screen access → `/usuarios-afiliados`
   - Default → `/dashboard`

4. **Careers validation**: `careers.validation.ts` enforces resume size (5MB), file type (PDF/DOCX), LGPD consent, and field requirements. These are business rules, not just tech validation.

5. **Cal.com proxy**: Scheduling calls go through `apiProd/cal/...` (proxied by backend), not directly to Cal.com. Do not bypass the proxy.

### Coding Standards to Follow

```
Component pattern:    Standalone (standalone: true, no NgModule)
Selector prefix:      front-zapfarma- (components), frontZapFarma (directives)
Service injection:    @Injectable({ providedIn: 'root' }) for new services
Styling:              SCSS, use CSS custom properties from styles.scss
Forms:                Angular Reactive Forms
HTTP calls:           HttpClient via service layer (never in components directly)
State:                sessionStorage for auth, RxJS BehaviorSubject for UI state
Naming:               Portuguese for business logic, English for Angular/tech patterns
Commit messages:      feat(scope): description in pt-br
File naming:          kebab-case for all files
```

---

## Development Guidelines

### How to Implement New Features

1. **Create the component**:
   ```bash
   # Page component
   src/app/pages/{feature-name}/{feature-name}.component.ts
   src/app/pages/{feature-name}/{feature-name}.component.html
   src/app/pages/{feature-name}/{feature-name}.component.scss

   # Reusable UI component
   src/app/ui/{component-name}/{component-name}.component.ts
   ```

2. **Use standalone pattern**:
   ```typescript
   @Component({
     selector: 'front-zapfarma-my-feature',
     standalone: true,
     imports: [CommonModule, MatIconModule, /* only what you need */],
     templateUrl: './my-feature.component.html',
     styleUrl: './my-feature.component.scss',
   })
   export class MyFeatureComponent {}
   ```

3. **Create a service** if the feature calls an API:
   ```typescript
   // src/app/services/{domain}/{domain}.service.ts
   @Injectable({ providedIn: 'root' })
   export class MyService {
     constructor(private readonly http: HttpClient) {}

     getData(): Observable<MyType> {
       return this.http.get<MyType>(`${environment.apiProd}/endpoint`);
     }
   }
   ```

4. **Add the route** in `app.routes.ts`:
   ```typescript
   {
     path: 'my-feature',
     component: MyFeatureComponent,
     canActivate: [UsuarioAutenticadoGuard], // if authenticated
   }
   ```

5. **Run checks**:
   ```bash
   npx nx lint front-zapfarma
   npx nx test front-zapfarma
   ```

### How to Avoid Breaking Existing Logic

- **Read `app.routes.ts`** before adding routes — check for path conflicts
- **Read the target service** before modifying it — check all consumers
- **Do not remove `any` types** from existing code without full type replacement — partial typing is worse than `any`
- **Do not change `httpOptions` headers** in existing services — they're there for legacy compatibility
- **Test SSR compatibility** — Use `isPlatformBrowser()` before accessing `window`, `document`, `sessionStorage`, or `localStorage`
- **Preserve base64 encoding** for session data — `sessionStorage.getItem('usuario')` returns base64-encoded JSON

### SSR Safety Checklist

When writing code that runs on the server:
- [ ] Guard `window` access with `isPlatformBrowser(platformId)`
- [ ] Guard `document` access with `@Inject(DOCUMENT)`
- [ ] Guard `sessionStorage` / `localStorage` with platform check
- [ ] Never use `setTimeout`/`setInterval` without platform check
- [ ] Return safe defaults for server-side rendering

---

## Anti-patterns to Avoid

### Based on Current Codebase Issues

1. **Do NOT duplicate token extraction logic**
   - BAD: Copy-pasting `obterTokenAutenticacao()` into a new service
   - GOOD: Import and use the existing `UsuariosService` or `auth.interceptor.ts`

2. **Do NOT set CORS headers on client-side requests**
   - BAD: `headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })`
   - GOOD: Just use `this.http.get(url)` — CORS is a server concern

3. **Do NOT create new NgModules**
   - BAD: `@NgModule({ declarations: [MyComponent], exports: [MyComponent] })`
   - GOOD: `@Component({ standalone: true, imports: [...] })`

4. **Do NOT store files as base64 in the database**
   - BAD: `resume_base64_content TEXT NOT NULL` (current pattern in careers)
   - GOOD: Upload to object storage, store URL reference

5. **Do NOT hardcode API URLs in components or services**
   - BAD: `this.http.get('https://api-integrations.zapfarma.com/endpoint')`
   - GOOD: `this.http.get(\`${environment.apiProd}/endpoint\`)`

6. **Do NOT use `@Injectable()` without `providedIn`**
   - BAD: `@Injectable()` (requires manual provider registration)
   - GOOD: `@Injectable({ providedIn: 'root' })`

7. **Do NOT access sessionStorage without null checks**
   - BAD: `JSON.parse(atob(sessionStorage.getItem('usuario')))`
   - GOOD: Check for null/empty before parsing, wrap in try/catch

8. **Do NOT commit secrets or API keys**
   - The Google Maps API key in `index.html` is a known issue — do not add more

9. **Do NOT write English user-facing strings**
   - All labels, error messages, placeholders, and tooltips must be in Portuguese (pt-BR)

10. **Do NOT modify existing test files to make them pass**
    - Fix the source code, not the tests

---

## Quick Reference

### Common Commands

```bash
npx nx serve front-zapfarma              # Dev server (http://localhost:4200)
npx nx run front-zapfarma:serve-ssr      # SSR dev server
npx nx build front-zapfarma              # Production build
npx nx lint front-zapfarma               # Lint
npx nx test front-zapfarma               # Unit tests
npx nx e2e front-zapfarma-e2e            # E2E tests (Playwright)
```

### Key Files to Read First

| File | Why |
|---|---|
| `src/app/app.routes.ts` | All route definitions and guards |
| `src/app/app.config.ts` | App-wide providers and configuration |
| `src/environments/environments.ts` | API endpoints |
| `src/app/interceptors/auth.interceptor.ts` | Auth token injection |
| `src/app/services/usuarios/usuarios.service.ts` | Core auth service |
| `src/styles.scss` | Design system / theme variables |
| `server.ts` | Express SSR server setup |

### Role Hierarchy

```
gerenciador (manager)  → Full access (dashboard, users, pharmacies, plans, AI config)
comercial (sales)      → Pharmacies access
representante (rep)    → Affiliated pharmacies access
(unauthenticated)      → Landing page, login, careers, public pages only
```
