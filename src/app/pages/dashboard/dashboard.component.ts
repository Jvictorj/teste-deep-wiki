import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { RouterLink } from '@angular/router';
import { FarmaciasService } from 'src/app/services/farmacias/farmacias.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';

interface DashboardDrogaria {
  id: string | number | null;
  nome: string;
  plano: string;
  data: string;
}

interface DashboardArquivoUpload {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  adicionadoEm: string;
  conteudoUrl: string;
}

@Component({
  selector: 'front-zapfarma-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, 
    frontZapFarmaMenuComponent, 
    frontZapFarmaHeaderComponent, 
    ReactiveFormsModule, 
    NgxMaskDirective, 
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  providers: [FarmaciasService],
})
export class DashboardComponent implements OnInit {
  private readonly storageKeyMarketing = 'zapfarma.dashboard.arquivos.marketing';
  private readonly storageKeyContratos = 'zapfarma.dashboard.arquivos.contratos';
  usuario:any;
  podeAcessarTelaUsuarios = false;
  podeGerenciarCentralArquivos = false;
  carregandoDrogariasCriadas = false;
  erroDrogariasCriadas: string | null = null;
  erroCentralArquivos: string | null = null;
  drogariasCriadasPorMim: DashboardDrogaria[] = [];
  arquivosMarketing: DashboardArquivoUpload[] = [];
  arquivosContratos: DashboardArquivoUpload[] = [];
  readonly limiteDrogariasCard = 5;

  constructor(
    private _usuariosService: UsuariosService,
    private _farmaciasService: FarmaciasService,
  ) {
    this.usuario = this._usuariosService.obterUsuarioLogado;
    this.podeAcessarTelaUsuarios =
      this._usuariosService.podeAcessarTelaUsuariosLogado;
    this.podeGerenciarCentralArquivos =
      this._usuariosService.podeGerenciarTudoLogado;
   }

  ngOnInit() {
    this.carregarArquivosPersistidos();
    this.carregarDrogariasCriadasPorMim();
  }

  get drogariasCriadasPreview(): DashboardDrogaria[] {
    return this.drogariasCriadasPorMim.slice(0, this.limiteDrogariasCard);
  }

  get totalDrogariasCriadasPorMim(): number {
    return this.drogariasCriadasPorMim.length;
  }

  get temMaisDrogariasCriadas(): boolean {
    return this.totalDrogariasCriadasPorMim > this.limiteDrogariasCard;
  }

  trackByDrogaria(_index: number, item: DashboardDrogaria): string {
    return `${item.id ?? ''}-${item.nome}`;
  }

  abrirSeletorArquivosMarketing(event: Event): void {
    if (!this.podeGerenciarCentralArquivos) {
      return;
    }
    event.stopPropagation();
    const input = document.getElementById('dashboard-marketing-files-input') as HTMLInputElement | null;
    input?.click();
  }

  abrirSeletorArquivosContratos(event: Event): void {
    if (!this.podeGerenciarCentralArquivos) {
      return;
    }
    event.stopPropagation();
    const input = document.getElementById('dashboard-contract-files-input') as HTMLInputElement | null;
    input?.click();
  }

  async onArquivosMarketingSelecionados(event: Event): Promise<void> {
    if (!this.podeGerenciarCentralArquivos) {
      return;
    }
    const input = event.target as HTMLInputElement;
    try {
      this.arquivosMarketing = await this.adicionarArquivos(input.files, this.arquivosMarketing, 'marketing');
      this.persistirArquivos();
    } catch {
      this.erroCentralArquivos = 'Falha ao processar os arquivos de marketing.';
    }
    input.value = '';
  }

  async onArquivosContratosSelecionados(event: Event): Promise<void> {
    if (!this.podeGerenciarCentralArquivos) {
      return;
    }
    const input = event.target as HTMLInputElement;
    try {
      this.arquivosContratos = await this.adicionarArquivos(input.files, this.arquivosContratos, 'contrato');
      this.persistirArquivos();
    } catch {
      this.erroCentralArquivos = 'Falha ao processar os arquivos de contrato.';
    }
    input.value = '';
  }

  removerArquivoMarketing(arquivoId: string, event: Event): void {
    if (!this.podeGerenciarCentralArquivos) {
      return;
    }
    event.stopPropagation();
    this.arquivosMarketing = this.arquivosMarketing.filter((arquivo) => arquivo.id !== arquivoId);
    this.persistirArquivos();
  }

  removerArquivoContrato(arquivoId: string, event: Event): void {
    if (!this.podeGerenciarCentralArquivos) {
      return;
    }
    event.stopPropagation();
    this.arquivosContratos = this.arquivosContratos.filter((arquivo) => arquivo.id !== arquivoId);
    this.persistirArquivos();
  }

  abrirArquivo(arquivo: DashboardArquivoUpload, event: Event): void {
    event.stopPropagation();
    if (!arquivo?.conteudoUrl) {
      return;
    }
    window.open(arquivo.conteudoUrl, '_blank', 'noopener');
  }

  formatarTamanhoArquivo(bytes: number): string {
    if (!bytes || bytes < 0) {
      return '0 B';
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  private carregarDrogariasCriadasPorMim(): void {
    if (!this.usuario?.id) {
      this.drogariasCriadasPorMim = [];
      return;
    }

    this.carregandoDrogariasCriadas = true;
    this.erroDrogariasCriadas = null;

    const consulta$ = this.usuario?.admin
      ? this._farmaciasService.consultarFarmacias()
      : this._farmaciasService.consultarFarmaciasAfiliados();

    consulta$.subscribe({
      next: (resposta: any) => {
        const farmacias = this.normalizarListaFarmacias(resposta);
        const exigeFiltroCriador = !!this.usuario?.admin;
        const filtradas = farmacias
          .filter((farmacia) =>
            exigeFiltroCriador ? this.isCriadaPeloUsuarioLogado(farmacia) : true
          )
          .map((farmacia) => this.mapearDrogariaDashboard(farmacia))
          .sort(
            (a, b) =>
              this.obterTimestampData(b.data) - this.obterTimestampData(a.data)
          );

        this.drogariasCriadasPorMim = filtradas;
        this.carregandoDrogariasCriadas = false;
      },
      error: () => {
        this.drogariasCriadasPorMim = [];
        this.carregandoDrogariasCriadas = false;
        this.erroDrogariasCriadas =
          'Não foi possível carregar as drogarias criadas por você.';
      },
    });
  }

  private normalizarListaFarmacias(resposta: any): any[] {
    if (Array.isArray(resposta)) {
      return resposta;
    }

    if (Array.isArray(resposta?.farmacias)) {
      return resposta.farmacias;
    }

    return [];
  }

  private isCriadaPeloUsuarioLogado(farmacia: any): boolean {
    const idCriador =
      farmacia?.idCriador ||
      farmacia?.idRepresentantes ||
      farmacia?.representantes?.id;

    return (
      !!idCriador &&
      !!this.usuario?.id &&
      String(idCriador) === String(this.usuario.id)
    );
  }

  private mapearDrogariaDashboard(farmacia: any): DashboardDrogaria {
    const nome =
      `${farmacia?.nomeFantasia || farmacia?.name || farmacia?.nome || farmacia?.razaoSocial || ''}`.trim() ||
      'Drogaria sem nome';
    const plano =
      `${farmacia?.nomePlanos || farmacia?.planos?.nome || farmacia?.planoNome || ''}`.trim() ||
      'Plano não informado';
    const data =
      `${farmacia?.data || farmacia?.createdAt || farmacia?.created_at || farmacia?.dataCriacao || ''}`.trim();

    return {
      id: farmacia?.id ?? null,
      nome,
      plano,
      data,
    };
  }

  private obterTimestampData(data: string): number {
    if (!data) {
      return 0;
    }

    const timestamp = new Date(data).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  private async adicionarArquivos(
    files: FileList | null,
    listaAtual: DashboardArquivoUpload[],
    prefixoId: string
  ): Promise<DashboardArquivoUpload[]> {
    this.erroCentralArquivos = null;
    const arquivosSelecionados = Array.from(files || []);
    if (!arquivosSelecionados.length) {
      return listaAtual;
    }

    const base = Date.now();
    const novosArquivos = await Promise.all(arquivosSelecionados.map(async (arquivo, indice) => ({
      id: `${prefixoId}-${base}-${indice}-${Math.random().toString(36).slice(2, 8)}`,
      nome: arquivo.name,
      tipo: arquivo.type || 'arquivo',
      tamanho: arquivo.size || 0,
      adicionadoEm: new Date().toISOString(),
      conteudoUrl: await this.converterArquivoParaDataUrl(arquivo),
    })));

    return [...listaAtual, ...novosArquivos];
  }

  private async converterArquivoParaDataUrl(arquivo: File): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(`${reader.result ?? ''}`);
      reader.onerror = () => reject(new Error('Falha ao converter arquivo.'));
      reader.readAsDataURL(arquivo);
    });
  }

  private carregarArquivosPersistidos(): void {
    this.arquivosMarketing = this.lerArquivosStorage(this.storageKeyMarketing);
    this.arquivosContratos = this.lerArquivosStorage(this.storageKeyContratos);
  }

  private lerArquivosStorage(chave: string): DashboardArquivoUpload[] {
    try {
      const valor = localStorage.getItem(chave) ?? '[]';
      const lista = JSON.parse(valor);
      if (!Array.isArray(lista)) {
        return [];
      }
      return lista.filter((arquivo) => !!arquivo?.id && !!arquivo?.nome && !!arquivo?.conteudoUrl);
    } catch {
      return [];
    }
  }

  private persistirArquivos(): void {
    try {
      localStorage.setItem(this.storageKeyMarketing, JSON.stringify(this.arquivosMarketing));
      localStorage.setItem(this.storageKeyContratos, JSON.stringify(this.arquivosContratos));
    } catch {
      this.erroCentralArquivos =
        'Não foi possível salvar os arquivos localmente. Tente arquivos menores.';
    }
  }

}
