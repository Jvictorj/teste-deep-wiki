import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrimeiroAcesssoComponent } from './pages/primeiro-acesso/primeiro-acesso.component';
import { MensageriaComponent } from './pages/mensageria/mensageria.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { ContatoClienteComponent } from './pages/contato-cliente/contato-cliente.component';
import { PlanosComponent } from './pages/planos/planos.component';
import { AreaLogadaComponent } from './pages/area-logada/area-logada.component';
import { CadastroEmpresasComponent } from './pages/empresas/cadastro/cadastro-empresas.component'
import { CadastroAfiliadosComponent } from './pages/cadastro-afiliados/cadastro-afiliados.component';
import { NovoUsuarioComponent } from './pages/novo-usuario/novo-usuario.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { UsuarioNaoAutenticadoGuard } from './services/guards/usuario-nao-autenticado.gard';
import { UsuarioAutenticadoGuard } from './services/guards/usuario-autenticado.gard';
import { PerfilGerenciadorGuard } from './services/guards/perfil-gerenciador.gard';
import { PerfilUsuariosGuard } from './services/guards/perfil-usuarios.gard';
import { PerfilDrogariasGuard } from './services/guards/perfil-drogarias.gard';
import { EditarEmpresasComponent } from './pages/empresas/editar/editar-empresas.component';
import { AlterarSenhaComponent } from './pages/alterar-senha/alterar-senha.component';
import { TreinamentosComponent } from './pages/treinamentos/treinamentos.component';
import { MapsComponent } from './pages/maps/maps.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { PoliticaPrivacidadeZapfarmaComponent } from './landing/politica-privacidade-zapfarma/politica-privacidade-zapfarma.component';
import { TermosUsoZapfarmaComponent } from './landing/termos-uso-zapfarma/termos-uso-zapfarma.component';
import { ConfiguracaoIaComponent } from './pages/configuracao-ia/configuracao-ia.component';
import { ConfiguracaoIaListaComponent } from './pages/configuracao-ia-lista/configuracao-ia-lista.component';
import { WhatsappCloudApiComponent } from './pages/whatsapp-cloud-api/whatsapp-cloud-api.component';
import { CriacaoDrogariaComponent } from './pages/criacao-drogaria/criacao-drogaria.component';
import { CoexApiOficialComponent } from './pages/coex-api-oficial/coex-api-oficial.component';
import { BusinessManagerMetaComponent } from './pages/business-manager-meta/business-manager-meta.component';
import { CriacaoSaasEmpresaComponent } from './pages/empresas/criacao-saas/criacao-saas-empresa.component';
import { TrabalheConoscoComponent } from './pages/trabalhe-conosco/trabalhe-conosco.component';


export const appRoutes: Route[] = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'assistente-ia', component: HomeComponent, data: { openChatIa: true } },
    { path: 'login', component: LoginComponent, canActivate: [UsuarioNaoAutenticadoGuard] },
    { path: 'primeiro-acesso', component: PrimeiroAcesssoComponent },
    { path: 'mensageria', component: MensageriaComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'empresas', component: EmpresasComponent, canActivate: [UsuarioAutenticadoGuard, PerfilDrogariasGuard]  },
    { path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
    { path: 'recuperar-senha', component: AlterarSenhaComponent },
    { path: 'recuperar-senha/:id', component: AlterarSenhaComponent },
    { path: 'alterar-senha', component: AlterarSenhaComponent },
    { path: 'alterar-senha/:id', component: AlterarSenhaComponent },
    { path: 'contato-cliente', component: ContatoClienteComponent },
    { path: 'planos', component: PlanosComponent, canActivate: [UsuarioAutenticadoGuard, PerfilGerenciadorGuard]  },
    { path: 'area-logada', component: AreaLogadaComponent, canActivate: [UsuarioAutenticadoGuard, PerfilGerenciadorGuard] },
    { path: 'area-loagada', redirectTo: 'area-logada', pathMatch: 'full' },
    { path: 'cadastro-empresas', component: CadastroEmpresasComponent, canActivate: [UsuarioAutenticadoGuard, PerfilDrogariasGuard] },
    { path: 'editar-empresas', component: EditarEmpresasComponent, canActivate: [UsuarioAutenticadoGuard, PerfilDrogariasGuard] },
    { path: 'cadastro-usuarios', component: CadastroAfiliadosComponent, canActivate: [UsuarioAutenticadoGuard, PerfilGerenciadorGuard] },
    { path: 'cadastro-afiliados', component: CadastroAfiliadosComponent, canActivate: [UsuarioAutenticadoGuard, PerfilGerenciadorGuard] },
    { path: 'novo-usuario', component: NovoUsuarioComponent, canActivate: [UsuarioNaoAutenticadoGuard] },
    { path: 'usuarios-afiliados', component: UsuariosComponent, canActivate: [UsuarioAutenticadoGuard, PerfilUsuariosGuard] },
    { path: 'treinamentos', component: TreinamentosComponent, canActivate: [UsuarioAutenticadoGuard, PerfilGerenciadorGuard] },
    { path: 'maps', component: MapsComponent, canActivate: [UsuarioAutenticadoGuard, PerfilGerenciadorGuard] },
    { path: 'sobre', component: SobreComponent},
    { path: 'trabalhe-conosco', component: TrabalheConoscoComponent },
    { path: 'politica-privacidade', component: PoliticaPrivacidadeZapfarmaComponent },
    { path: 'politica-privacidade-zapfarma', component: PoliticaPrivacidadeZapfarmaComponent },
    { path: 'termos-uso', component: TermosUsoZapfarmaComponent},
    { path: 'onboarding-ia', component: ConfiguracaoIaComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'onboarding-ia/lista', component: ConfiguracaoIaListaComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'whatsapp-cloud-api', component: WhatsappCloudApiComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'criacao-empresa-saas', component: CriacaoSaasEmpresaComponent, canActivate: [UsuarioAutenticadoGuard, PerfilDrogariasGuard] },
    { path: 'criacao-drogaria', component: CriacaoDrogariaComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'coex-api-oficial', component: CoexApiOficialComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: 'business-manager-meta', component: BusinessManagerMetaComponent, canActivate: [UsuarioAutenticadoGuard] },
    { path: '**', redirectTo: 'home' },
];

import { provideRouter, Routes, withInMemoryScrolling } from '@angular/router';



export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

// Se o projeto usa o novo standalone API do Angular (sem NgModule):
export const appRouterProviders = [
  provideRouter(
    routes,
    withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  )
];
