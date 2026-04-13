import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FarmaciasService } from 'src/app/services/farmacias/farmacias.service';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';


export interface UserData {
  id: string;
  name: string;
  progress: string;
  dpto: string;
}

interface SaasArquivoRegistro {
  nome: string;
  atualizadoEm: string;
}

interface DrogariaArquivoRegistro {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  adicionadoEm: string;
  vinculadoSaas?: boolean;
}

type StatusPagamentoBadge = 'paid' | 'pending' | 'overdue' | 'unknown';

interface SaasCriadoRegistro {
  createdAt: string;
  companyId?: number | null;
}

@Component({
  selector: 'front-zapfarma-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    frontZapFarmaMenuComponent,
    frontZapFarmaHeaderComponent,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,

  ],
  providers: [FarmaciasService, provideNgxMask(),],
  
})
export class EmpresasComponent {
  @ViewChild('tableScroll') matElements: ElementRef<HTMLTableElement> =
    {} as ElementRef;
  @ViewChild('input') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('drogariaArquivosModal') drogariaArquivosModal?: TemplateRef<any>;
  displayedColumns: string[] = [
    'nomeFantasia',
    'afiliados',
    'whatsApp',
    'nomePlanos',
    'saas',
    'data',
    'acoes',
  ];
  dataSource: MatTableDataSource<UserData>;
  dadosNotificacao = '';
  dadosNotificacaoNome = '';
  name = '';
  usuario:any;
  loadSkeleton = false;
  private readonly saasStorageKey = 'zapfarma.saas.arquivos';
  private readonly saasRemovidosStorageKey = 'zapfarma.saas.removidos';
  private readonly saasEmpresasCriadasStorageKey = 'zapfarma.saas.empresas-criadas';
  private saasEmpresasCriadasCache: Record<string, SaasCriadoRegistro> | null = null;
  private readonly drogariaArquivosStorageKey = 'zapfarma.drogaria.arquivos';
  private readonly mensagemAnexoSaasBloqueado = 'espere o time comercial adicionar o contrato para criar o SAAS';
  arquivosDrogariaModal: DrogariaArquivoRegistro[] = [];
  farmaciaArquivosModal: any = null;
  private dialogArquivosDrogariaRef: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  svc: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selection = new SelectionModel<any>(true, []);
  // eslint-disable-next-line @typescript-eslint/ban-types

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _farmaciasService: FarmaciasService,
    private activatedRoute: ActivatedRoute,
    private _usuariosService: UsuariosService,
    
    
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];
      const nome = params['nome'];
      this.dadosNotificacao = id;
      this.dadosNotificacaoNome = nome;
    });
    this.usuario = this._usuariosService.obterUsuarioLogado;
    this.getFarmacias();
  }

  irCadastrar() {
    this.router.navigate(['/cadastro-empresas']);
  }

  irAtualizar(id: any) {
    this.router.navigate(['/editar-empresas'], { queryParams: { id: id } })
  }

  obterStatusPagamentoBadge(row: any): StatusPagamentoBadge {
    const boolPagamentoEmDia = row?.pagamentoEmDia ?? row?.paymentOk;
    if (typeof boolPagamentoEmDia === 'boolean') {
      return boolPagamentoEmDia ? 'paid' : 'overdue';
    }

    const statusBruto =
      row?.pagamentoStatus ??
      row?.paymentStatus ??
      row?.statusPagamento ??
      row?.billingStatus ??
      row?.financeiro?.status ??
      row?.assinatura?.status ??
      row?.invoice?.status ??
      '';

    const status = this.normalizarTextoStatus(statusBruto);
    if (!status) {
      return 'unknown';
    }

    if (
      [
        'paid',
        'pago',
        'quitado',
        'adimplente',
        'emdia',
        'em_dia',
        'active',
        'ativo',
        'approved',
        'aprovado',
        'ok',
        'success',
        'sucesso',
      ].includes(status)
    ) {
      return 'paid';
    }

    if (
      [
        'pending',
        'pendente',
        'emaberto',
        'em_aberto',
        'aberto',
        'open',
        'processing',
        'processando',
        'aguardando',
        'waiting',
        'trial',
      ].includes(status)
    ) {
      return 'pending';
    }

    if (
      [
        'overdue',
        'vencido',
        'atrasado',
        'inadimplente',
        'late',
        'unpaid',
        'naopago',
        'nao_pago',
        'blocked',
        'bloqueado',
        'cancelled',
        'canceled',
        'cancelado',
        'suspended',
        'suspenso',
      ].includes(status)
    ) {
      return 'overdue';
    }

    return 'unknown';
  }

  obterDescricaoStatusPagamento(row: any): string {
    const status = this.obterStatusPagamentoBadge(row);

    if (status === 'paid') {
      return 'Pagamento em dia';
    }

    if (status === 'pending') {
      return 'Pagamento pendente';
    }

    if (status === 'overdue') {
      return 'Pagamento atrasado';
    }

    return 'Status de pagamento não informado';
  }

  private obterPerfilNormalizado(): string {
    const perfilLogado = `${this._usuariosService.obterPerfilUsuarioLogadoNormalizado ?? ''}`
      .trim()
      .toLowerCase();

    if (perfilLogado) {
      return perfilLogado;
    }

    return `${this.usuario?.perfil ?? this.usuario?.profile ?? this.usuario?.funcao_departamento ?? ''}`
      .trim()
      .toLowerCase();
  }

  canExcluirFarmacia(): boolean {
    const perfil = this.obterPerfilNormalizado();
    return Boolean(
      this.usuario?.admin ||
      this.usuario?.superAdmin ||
      this.usuario?.admin_sys ||
      perfil === 'gerenciador'
    );
  }

  podeAnexarArquivoSaas(): boolean {
    return this.obterPerfilNormalizado() !== 'representante';
  }

  isSaasCriado(row: any): boolean {
    const flags = [
      row?.saasCriado,
      row?.saasCreated,
      row?.empresaSaasCriada,
      row?.companyCreated,
      row?.temSaas,
      row?.possuiSaas,
    ];
    if (flags.some((flag) => flag === true)) {
      return true;
    }

    const candidatosIdCompany = [
      row?.companyId,
      row?.idCompany,
      row?.empresaId,
      row?.saasCompanyId,
      row?.company?.id,
      row?.company?.companyId,
      row?.assinatura?.companyId,
      row?.financeiro?.companyId,
    ];
    const temCompanyId = candidatosIdCompany.some((candidato) => {
      const id = Number(candidato);
      return !Number.isNaN(id) && id > 0;
    });
    if (temCompanyId) {
      return true;
    }

    const statusBruto =
      row?.saasStatus ??
      row?.statusSaas ??
      row?.companyStatus ??
      row?.statusCompany ??
      row?.assinatura?.status ??
      row?.company?.status ??
      '';
    const status = this.normalizarTextoStatus(statusBruto);
    if (
      [
        'created',
        'criado',
        'active',
        'ativo',
        'enabled',
        'habilitado',
        'ok',
      ].includes(status)
    ) {
      return true;
    }

    return this.saasEmpresaFoiCriadaLocal(row);
  }

  apagarFarmacia(row: any, event: Event) {
    event.stopPropagation();

    if (!this.canExcluirFarmacia()) {
      alert('Você não tem permissão para apagar drogarias.');
      return;
    }

    const nome = row?.nomeFantasia || 'esta drogaria';
    const confirmado = window.confirm(`Deseja realmente apagar ${nome}?`);
    if (!confirmado || !row?.id) {
      return;
    }

    this._farmaciasService.ExcluirFarmacias(row.id).subscribe({
      next: () => {
        this.removerArquivosDrogariaLocal(row);
        this.svc = (this.svc || []).filter((farmacia: any) => String(farmacia?.id) !== String(row.id));
        this.atualizarTabela(this.svc);
      },
      error: (erro: any) => {
        const mensagem = erro?.error?.error || 'Não foi possível apagar a drogaria.';
        alert(mensagem);
      },
    });
  }

  obterInputArquivoSaasId(row: any): string {
    return `saas-file-${this.obterIdentificadorSeguroFarmacia(row)}`;
  }

  abrirSeletorArquivoSaas(row: any, event: Event) {
    event.stopPropagation();
    if (!this.podeAnexarArquivoSaas()) {
      alert(this.mensagemAnexoSaasBloqueado);
      return;
    }
    if (this.isSaasCriado(row)) {
      return;
    }
    const input = document.getElementById(this.obterInputArquivoSaasId(row)) as HTMLInputElement | null;
    input?.click();
  }

  onSaasArquivoSelecionado(event: Event, row: any) {
    event.stopPropagation();
    if (!this.podeAnexarArquivoSaas() || this.isSaasCriado(row)) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    row.saasArquivoNome = file.name;
    row.temArquivoSaas = true;
    this.removerMarcacaoArquivoSaasRemovido(row);
    this.salvarArquivoSaasLocal(row, file.name);
    this.sincronizarArquivoSaasNoAcervoDrogaria(
      row,
      file.name,
      file.size || 0,
      file.type || 'saas'
    );
    input.value = '';
  }

  temArquivoSaas(row: any): boolean {
    return !!(row?.temArquivoSaas || row?.saasArquivoNome);
  }

  obterNomeArquivoSaas(row: any): string {
    return row?.saasArquivoNome || '';
  }

  criarSaas(row: any, event: Event) {
    event.stopPropagation();

    if (!this.temArquivoSaas(row) || this.isSaasCriado(row)) {
      return;
    }

    this.router.navigate(['/criacao-empresa-saas'], {
      queryParams: {
        idFarmacia: row?.id || '',
        drogaria: row?.nomeFantasia || '',
      },
    });
  }

  desanexarArquivoSaas(row: any, event: Event) {
    event.stopPropagation();
    if (this.isSaasCriado(row)) {
      return;
    }

    this.removerArquivoSaasLocal(row);
    this.removerArquivoSaasNoAcervoDrogaria(row);
    this.marcarArquivoSaasComoRemovido(row);
    row.saasArquivoNome = '';
    row.temArquivoSaas = false;
  }

  abrirModalArquivosDrogaria(row: any, event: Event) {
    event.stopPropagation();
    if (!this.drogariaArquivosModal) {
      return;
    }

    this.garantirArquivoSaasNoAcervoDrogaria(row);
    this.farmaciaArquivosModal = row;
    this.arquivosDrogariaModal = this.obterArquivosDrogaria(row);

    this.dialogArquivosDrogariaRef = this.dialog.open(this.drogariaArquivosModal, {
      width: '700px',
      maxWidth: '96vw',
      autoFocus: false,
      panelClass: 'drogaria-arquivos-dialog-panel',
    });

    this.dialogArquivosDrogariaRef.afterClosed().subscribe(() => {
      this.farmaciaArquivosModal = null;
      this.arquivosDrogariaModal = [];
    });
  }

  fecharModalArquivosDrogaria() {
    this.dialogArquivosDrogariaRef?.close();
  }

  abrirSeletorArquivosDrogaria(event: Event) {
    event.stopPropagation();
    if (!this.farmaciaArquivosModal) {
      return;
    }
    const input = document.getElementById(this.obterInputArquivosDrogariaId()) as HTMLInputElement | null;
    input?.click();
  }

  onArquivosDrogariaSelecionados(event: Event) {
    event.stopPropagation();
    if (!this.farmaciaArquivosModal) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const arquivosSelecionados = Array.from(input.files || []);
    if (!arquivosSelecionados.length) {
      return;
    }

    const novosArquivos: DrogariaArquivoRegistro[] = arquivosSelecionados.map((arquivo, indice) => ({
      id: `${Date.now()}-${indice}-${Math.random().toString(36).slice(2, 8)}`,
      nome: arquivo.name,
      tipo: arquivo.type || 'arquivo',
      tamanho: arquivo.size || 0,
      adicionadoEm: new Date().toISOString(),
      vinculadoSaas: false,
    }));

    const listaAtual = this.obterArquivosDrogaria(this.farmaciaArquivosModal);
    const listaAtualizada = [...novosArquivos, ...listaAtual];
    this.salvarArquivosDrogaria(this.farmaciaArquivosModal, listaAtualizada);
    this.arquivosDrogariaModal = listaAtualizada;
    input.value = '';
  }

  removerArquivoDrogaria(arquivoId: string, event: Event) {
    event.stopPropagation();
    if (!this.farmaciaArquivosModal) {
      return;
    }

    const arquivoRemovido = (this.arquivosDrogariaModal || []).find((arquivo) => arquivo.id === arquivoId);
    if (!arquivoRemovido || !this.podeRemoverArquivoDrogaria(arquivoRemovido)) {
      return;
    }

    const listaAtualizada = (this.arquivosDrogariaModal || []).filter((arquivo) => arquivo.id !== arquivoId);
    this.salvarArquivosDrogaria(this.farmaciaArquivosModal, listaAtualizada);
    this.arquivosDrogariaModal = listaAtualizada;

    if (this.ehArquivoVinculadoSaas(arquivoRemovido)) {
      this.removerArquivoSaasLocal(this.farmaciaArquivosModal);
      this.marcarArquivoSaasComoRemovido(this.farmaciaArquivosModal);
      this.desmarcarSaasCriadoLocal(this.farmaciaArquivosModal);
      this.limparSinalizadoresSaasLinha(this.farmaciaArquivosModal);
      this.farmaciaArquivosModal.saasArquivoNome = '';
      this.farmaciaArquivosModal.temArquivoSaas = false;
    }
  }

  podeRemoverArquivoDrogaria(arquivo: DrogariaArquivoRegistro): boolean {
    if (!arquivo) {
      return false;
    }

    if (!this.ehArquivoVinculadoSaas(arquivo)) {
      return true;
    }

    if (!this.farmaciaArquivosModal) {
      return false;
    }

    if (!this.isSaasCriado(this.farmaciaArquivosModal)) {
      return true;
    }

    return this.canExcluirFarmacia();
  }

  obterInputArquivosDrogariaId(): string {
    return `drogaria-files-${this.obterIdentificadorSeguroFarmacia(this.farmaciaArquivosModal)}`;
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

  getFarmacias(): void {
    this.loadSkeleton = true;
    this.saasEmpresasCriadasCache = null;
    if(!this.dadosNotificacao) {
      if(!this.usuario.admin) {
        this._farmaciasService.consultarFarmaciasAfiliados().subscribe((svc:any) => {
          this.svc = svc ? svc : [];
          this.svc.forEach((e: any, i: number) => {
            // this.svc[i].aprovado = e.aprovado === true ? 'Sim': 'Não';
            // this.svc[i].data = this.dataConvertida(e.data);
            this.preencherDadosCriador(this.svc[i], this.usuario?.nome || '');
          });
          this.atualizarTabela(this.svc ? this.svc : []);
          this.loadSkeleton = false;
        });
      } else {
        this._farmaciasService.consultarFarmacias().subscribe((svc:any) => {
          this.svc = svc ? svc?.farmacias : [];
          this.svc.forEach((e: any, i: number) => {
            // this.svc[i].aprovado = e.aprovado === true ? 'Sim': 'Não';
            this.preencherDadosCriador(this.svc[i]);
            this.svc[i].nomePlanos = e?.planos?.nome || '';
          });
          this.atualizarTabela(this.svc ? this.svc : []);
          this.loadSkeleton = false;
        });
      }
    } else {
      this._farmaciasService.consultarFarmaciasAfiliadosCPF(this.dadosNotificacao).subscribe((svc:any) => {
        this.svc = svc ? svc?.farmacias : [];
        this.svc = svc ? svc : [];
        this.svc.forEach((e: any, i: number) => {
          // this.svc[i].aprovado = e.aprovado === true ? 'Sim': 'Não';
          // this.svc[i].data = this.dataConvertida(e.data);
          this.preencherDadosCriador(this.svc[i], this.dadosNotificacaoNome);
          
        });
        this.atualizarTabela(this.svc ? this.svc : []);
        this.loadSkeleton = false;
      });
    }
  }

  get totalDrogarias(): number {
    return this.dataSource?.data?.length || 0;
  }

  get totalComSaas(): number {
    return (this.dataSource?.data || []).filter((row: any) => this.temArquivoSaas(row)).length;
  }

  get totalCriadasPorMim(): number {
    return (this.dataSource?.data || []).filter((row: any) => this.isCriadoPeloUsuarioLogado(row)).length;
  }

  dataConvertida(data: Date): string {
    const d = new Date(data);
    const dia = d.getDate().toString();
    const diaF = dia.length == 1 ? '0' + dia : dia;
    const mes = (d.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    const mesF = mes.length == 1 ? '0' + mes : mes;
    const anoF = d.getFullYear();
    return diaF + '/' + mesF + '/' + anoF;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.aplicarFiltroTexto(filterValue);
  }

  limparFiltroPesquisa(event: Event) {
    event.stopPropagation();
    this.aplicarFiltroTexto('');
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.selection.selected.length > 0) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  clickScroll() {
    this.matElements.nativeElement.animate(
      { scrollLeft: this.matElements.nativeElement.offsetLeft },
      500
    );
  }

  obterNomeCriador(row: any): string {
    const nome =
      row?.nomeCriador ||
      row?.nomeRepresentante ||
      row?.representantes?.nome ||
      row?.usuarioCriador?.nome ||
      row?.criadoPor?.nome ||
      '';

    if (nome) {
      return nome;
    }

    if (this.isCriadoPeloUsuarioLogado(row) && this.usuario?.nome) {
      return this.usuario.nome;
    }

    return 'Não identificado';
  }

  isCriadoPeloUsuarioLogado(row: any): boolean {
    const idCriador =
      row?.idCriador || row?.idRepresentantes || row?.representantes?.id;
    return !!idCriador && !!this.usuario?.id && String(idCriador) === String(this.usuario.id);
  }

  private atualizarTabela(farmacias: any[]) {
    const lista = this.aplicarStatusSaas(farmacias);
    this.dataSource = new MatTableDataSource(lista);
    this.dataSource.sortingDataAccessor = (item: any, property: string): string | number => {
      if (property === 'afiliados') {
        return this.obterNomeCriador(item).toLowerCase();
      }

      if (property === 'data') {
        return item?.data ? new Date(item.data).getTime() : 0;
      }

      const valor = item?.[property];
      if (typeof valor === 'number') {
        return valor;
      }
      if (typeof valor === 'string') {
        return valor.toLowerCase();
      }
      if (valor instanceof Date) {
        return valor.getTime();
      }

      return `${valor ?? ''}`.toLowerCase();
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private aplicarFiltroTexto(valor: string) {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.filter = (valor || '').trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private preencherDadosCriador(farmacia: any, fallbackNome = '') {
    farmacia.idCriador =
      farmacia?.idCriador || farmacia?.idRepresentantes || farmacia?.representantes?.id || null;
    farmacia.nomeCriador =
      farmacia?.nomeCriador ||
      farmacia?.usuarioCriador?.nome ||
      farmacia?.criadoPor?.nome ||
      farmacia?.representantes?.nome ||
      farmacia?.nomeRepresentante ||
      fallbackNome ||
      '';
    farmacia.nomeRepresentante = farmacia.nomeRepresentante || farmacia.nomeCriador;
  }

  private aplicarStatusSaas(farmacias: any[]): any[] {
    return (farmacias || []).map((farmacia) => {
      const removidoLocal = this.arquivoSaasFoiRemovido(farmacia);
      const nomeArquivoApi =
        farmacia?.saasArquivoNome ||
        farmacia?.arquivoSaasNome ||
        farmacia?.anexoSaasNome ||
        farmacia?.nomeArquivoSaas ||
        '';
      const flagArquivoApi =
        !!farmacia?.temArquivoSaas ||
        !!farmacia?.arquivoSaas ||
        !!farmacia?.anexoSaas;
      const registroLocal = this.obterArquivoSaasLocal(farmacia);
      const nomeArquivo = nomeArquivoApi || registroLocal?.nome || '';

      return {
        ...farmacia,
        saasArquivoNome: removidoLocal ? '' : nomeArquivo,
        temArquivoSaas: removidoLocal ? false : flagArquivoApi || !!nomeArquivo,
      };
    });
  }

  private obterArquivoSaasLocal(farmacia: any): SaasArquivoRegistro | null {
    const mapa = this.obterMapaArquivosSaas();

    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      const registro = mapa[chave];
      if (registro) {
        return registro;
      }
    }

    return null;
  }

  private salvarArquivoSaasLocal(farmacia: any, nomeArquivo: string) {
    const mapa = this.obterMapaArquivosSaas();
    const registro: SaasArquivoRegistro = {
      nome: nomeArquivo,
      atualizadoEm: new Date().toISOString(),
    };

    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      mapa[chave] = registro;
    }

    this.persistirMapaArquivosSaas(mapa);
  }

  private removerArquivoSaasLocal(farmacia: any) {
    const mapa = this.obterMapaArquivosSaas();

    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      delete mapa[chave];
    }

    this.persistirMapaArquivosSaas(mapa);
  }

  private arquivoSaasFoiRemovido(farmacia: any): boolean {
    const mapa = this.obterMapaArquivosSaasRemovidos();
    return this.gerarChavesFarmacia(farmacia).some((chave) => !!mapa[chave]);
  }

  private marcarArquivoSaasComoRemovido(farmacia: any) {
    const mapa = this.obterMapaArquivosSaasRemovidos();

    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      mapa[chave] = true;
    }

    this.persistirMapaArquivosSaasRemovidos(mapa);
  }

  private removerMarcacaoArquivoSaasRemovido(farmacia: any) {
    const mapa = this.obterMapaArquivosSaasRemovidos();

    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      delete mapa[chave];
    }

    this.persistirMapaArquivosSaasRemovidos(mapa);
  }

  private gerarChavesFarmacia(farmacia: any): string[] {
    const chaves: string[] = [];

    if (farmacia?.id) {
      chaves.push(`id:${farmacia.id}`);
    }

    const documento = this.normalizarDocumento(farmacia?.cpfCnpj || '');
    if (documento) {
      chaves.push(`doc:${documento}`);
    }

    return chaves;
  }

  private obterIdentificadorSeguroFarmacia(farmacia: any): string {
    const identificador =
      farmacia?.id || this.normalizarDocumento(farmacia?.cpfCnpj) || farmacia?.nomeFantasia || 'linha';
    return String(identificador).replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  private normalizarDocumento(valor: string): string {
    return (valor || '').replace(/\D/g, '');
  }

  private normalizarTextoStatus(valor: unknown): string {
    return `${valor ?? ''}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .trim()
      .toLowerCase();
  }

  private saasEmpresaFoiCriadaLocal(farmacia: any): boolean {
    const mapa = this.obterMapaSaasEmpresasCriadas();
    return this.gerarChavesFarmacia(farmacia).some((chave) => !!mapa[chave]);
  }

  private desmarcarSaasCriadoLocal(farmacia: any) {
    const mapa = this.obterMapaSaasEmpresasCriadas();
    let alterou = false;

    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      if (mapa[chave]) {
        delete mapa[chave];
        alterou = true;
      }
    }

    if (!alterou) {
      return;
    }

    this.saasEmpresasCriadasCache = mapa;
    localStorage.setItem(this.saasEmpresasCriadasStorageKey, JSON.stringify(mapa));
  }

  private limparSinalizadoresSaasLinha(farmacia: any) {
    if (!farmacia || typeof farmacia !== 'object') {
      return;
    }

    farmacia.saasCriado = false;
    farmacia.saasCreated = false;
    farmacia.empresaSaasCriada = false;
    farmacia.companyCreated = false;
    farmacia.temSaas = false;
    farmacia.possuiSaas = false;
    farmacia.saasStatus = '';
    farmacia.statusSaas = '';
    farmacia.companyStatus = '';
    farmacia.statusCompany = '';

    farmacia.companyId = null;
    farmacia.idCompany = null;
    farmacia.empresaId = null;
    farmacia.saasCompanyId = null;

    if (farmacia.company && typeof farmacia.company === 'object') {
      farmacia.company.id = null;
      farmacia.company.companyId = null;
      farmacia.company.status = '';
    }

    if (farmacia.assinatura && typeof farmacia.assinatura === 'object') {
      farmacia.assinatura.companyId = null;
      farmacia.assinatura.status = '';
    }

    if (farmacia.financeiro && typeof farmacia.financeiro === 'object') {
      farmacia.financeiro.companyId = null;
    }
  }

  private obterMapaSaasEmpresasCriadas(): Record<string, SaasCriadoRegistro> {
    if (this.saasEmpresasCriadasCache !== null) {
      return this.saasEmpresasCriadasCache;
    }

    const bruto = localStorage.getItem(this.saasEmpresasCriadasStorageKey);
    let mapa: Record<string, SaasCriadoRegistro> = {};

    if (bruto) {
      try {
        const parseado = JSON.parse(bruto);
        if (parseado && typeof parseado === 'object' && !Array.isArray(parseado)) {
          mapa = parseado as Record<string, SaasCriadoRegistro>;
        }
      } catch {
        mapa = {};
      }
    }

    this.saasEmpresasCriadasCache = mapa;
    return mapa;
  }

  private obterMapaArquivosSaas(): Record<string, SaasArquivoRegistro> {
    const bruto = localStorage.getItem(this.saasStorageKey);

    if (!bruto) {
      return {};
    }

    try {
      return JSON.parse(bruto);
    } catch {
      return {};
    }
  }

  private persistirMapaArquivosSaas(mapa: Record<string, SaasArquivoRegistro>) {
    localStorage.setItem(this.saasStorageKey, JSON.stringify(mapa));
  }

  private obterMapaArquivosSaasRemovidos(): Record<string, boolean> {
    const bruto = localStorage.getItem(this.saasRemovidosStorageKey);

    if (!bruto) {
      return {};
    }

    try {
      return JSON.parse(bruto);
    } catch {
      return {};
    }
  }

  private persistirMapaArquivosSaasRemovidos(mapa: Record<string, boolean>) {
    localStorage.setItem(this.saasRemovidosStorageKey, JSON.stringify(mapa));
  }

  private obterIdArquivoSaasDrogaria(farmacia: any): string {
    return `saas-arquivo:${this.obterIdentificadorSeguroFarmacia(farmacia)}`;
  }

  private ehArquivoVinculadoSaas(arquivo: DrogariaArquivoRegistro): boolean {
    if (!arquivo) {
      return false;
    }
    return (
      arquivo.vinculadoSaas === true ||
      arquivo.tipo === 'saas' ||
      String(arquivo.id || '').startsWith('saas-arquivo:')
    );
  }

  private sincronizarArquivoSaasNoAcervoDrogaria(
    farmacia: any,
    nomeArquivo: string,
    tamanho = 0,
    tipoArquivo = 'saas'
  ) {
    const nome = `${nomeArquivo || ''}`.trim();
    if (!nome) {
      return;
    }

    const listaAtual = this.obterArquivosDrogaria(farmacia);
    const registroSaasAtual = listaAtual.find((arquivo) => this.ehArquivoVinculadoSaas(arquivo));
    const listaSemSaas = listaAtual.filter((arquivo) => !this.ehArquivoVinculadoSaas(arquivo));
    const registroSaas: DrogariaArquivoRegistro = {
      id: this.obterIdArquivoSaasDrogaria(farmacia),
      nome,
      tipo: tipoArquivo || 'saas',
      tamanho: tamanho || registroSaasAtual?.tamanho || 0,
      adicionadoEm: registroSaasAtual?.adicionadoEm || new Date().toISOString(),
      vinculadoSaas: true,
    };

    this.salvarArquivosDrogaria(farmacia, [registroSaas, ...listaSemSaas]);
  }

  private garantirArquivoSaasNoAcervoDrogaria(farmacia: any) {
    if (!this.temArquivoSaas(farmacia)) {
      return;
    }

    const nomeArquivo = this.obterNomeArquivoSaas(farmacia);
    if (!nomeArquivo) {
      return;
    }

    this.sincronizarArquivoSaasNoAcervoDrogaria(farmacia, nomeArquivo);
  }

  private removerArquivoSaasNoAcervoDrogaria(farmacia: any) {
    const listaAtual = this.obterArquivosDrogaria(farmacia);
    const listaAtualizada = listaAtual.filter((arquivo) => !this.ehArquivoVinculadoSaas(arquivo));
    this.salvarArquivosDrogaria(farmacia, listaAtualizada);
  }

  private obterArquivosDrogaria(farmacia: any): DrogariaArquivoRegistro[] {
    const mapa = this.obterMapaArquivosDrogaria();
    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      const lista = mapa[chave];
      if (Array.isArray(lista)) {
        return lista;
      }
    }
    return [];
  }

  private salvarArquivosDrogaria(farmacia: any, arquivos: DrogariaArquivoRegistro[]) {
    const mapa = this.obterMapaArquivosDrogaria();
    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      mapa[chave] = arquivos;
    }
    this.persistirMapaArquivosDrogaria(mapa);
  }

  private removerArquivosDrogariaLocal(farmacia: any) {
    const mapa = this.obterMapaArquivosDrogaria();
    for (const chave of this.gerarChavesFarmacia(farmacia)) {
      delete mapa[chave];
    }
    this.persistirMapaArquivosDrogaria(mapa);
  }

  private obterMapaArquivosDrogaria(): Record<string, DrogariaArquivoRegistro[]> {
    const bruto = localStorage.getItem(this.drogariaArquivosStorageKey);
    if (!bruto) {
      return {};
    }

    try {
      return JSON.parse(bruto);
    } catch {
      return {};
    }
  }

  private persistirMapaArquivosDrogaria(mapa: Record<string, DrogariaArquivoRegistro[]>) {
    localStorage.setItem(this.drogariaArquivosStorageKey, JSON.stringify(mapa));
  }
}
