import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
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
import { MatNativeDateModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { catchError, of } from 'rxjs';


export interface UserData {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  cep: string;
  data: string;
  perfil?: string;
  profile?: string;
  funcao_departamento?: string;
}

@Component({
  selector: 'front-zapfarma-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
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
  providers: [UsuariosService,  provideNgxMask(),],
  
})
export class UsuariosComponent implements AfterViewInit {
  @ViewChild('tableScroll') matElements: ElementRef<HTMLTableElement> =
    {} as ElementRef;
  displayedColumns: string[] = [
    'cpfCnpj',
    'nome',
    'perfil',
    'telefone',
    'cep',
    'data',
  ];
  podeExcluirUsuarios = false;
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  dadosNotificacao = '';
  name = '';
  loadSkeleton = false;
  erroCarregamento = '';
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
    private _usuariosService: UsuariosService,
    private activatedRoute: ActivatedRoute
  ) {
    this.podeExcluirUsuarios = this.canExcluirUsuario();
    if (this.podeExcluirUsuarios) {
      this.displayedColumns.push('acoes');
    }

    this.activatedRoute.queryParams.subscribe((params) => {
      const cpf = params['cpf'];
      this.dadosNotificacao = this.normalizarValorFiltro(cpf);
    });
    this.getFarmacias();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  irCadastrar() {
    this.router.navigate(['/cadastro-usuarios']);
  }

  canExcluirUsuario(): boolean {
    return this._usuariosService.perfilGerenciadorLogado;
  }


  getFarmacias(): void {
    this.loadSkeleton = true;
    this.erroCarregamento = '';
    this._usuariosService
      .consultaUsuarios()
      .pipe(
        catchError(() => {
          this.erroCarregamento = 'Não foi possível carregar os usuários.';
          this.loadSkeleton = false;
          return of([]);
        })
      )
      .subscribe((svc:any) => {
        this.svc = this.extrairUsuariosDaResposta(svc);
        this.svc.forEach((e: any, i: number) => {
          // this.svc[i].aprovado = e.aprovado === true ? 'Sim': 'Não';
          // this.svc[i].data = this.dataConvertida(e.data);
        });
        this.dataSource = new MatTableDataSource(this.svc ? this.svc : []);
        this.dataSource.sortingDataAccessor = (item: UserData, property: string) => {
          if (property === 'perfil') {
            return this.getPerfilLabel(item).toLowerCase();
          }
          const value = (item as unknown as Record<string, string | number | boolean | null | undefined>)?.[property];
          if (typeof value === 'number') {
            return value;
          }
          return `${value ?? ''}`;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loadSkeleton = false;
      });
  }

  extrairUsuariosDaResposta(resposta: any): UserData[] {
    if (Array.isArray(resposta)) {
      return resposta;
    }

    const candidatos = [
      resposta?.usuariosRepresentantes,
      resposta?.usuariosAfiliados,
      resposta?.usuarios,
      resposta?.data?.usuariosRepresentantes,
      resposta?.data?.usuariosAfiliados,
      resposta?.data?.usuarios,
      resposta?.result,
      resposta?.data,
    ];

    const lista = candidatos.find((item) => Array.isArray(item));
    return Array.isArray(lista) ? lista : [];
  }

  normalizarValorFiltro(valor: unknown): string {
    const texto = `${valor ?? ''}`.trim();
    if (!texto) {
      return '';
    }
    const textoLower = texto.toLowerCase();
    if (textoLower === 'undefined' || textoLower === 'null') {
      return '';
    }
    return texto;
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
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  irAtualizar(id: any, nome: string) {
    this.router.navigate(['/empresas'], { queryParams: { id: id, nome: nome } })
  }

  apagarUsuario(row: UserData, event: Event) {
    event.stopPropagation();

    if (!this.canExcluirUsuario()) {
      alert('Somente gerenciador pode apagar usuário.');
      return;
    }

    if (!row?.id) {
      return;
    }

    const nome = row?.nome || 'este usuário';
    const confirmado = window.confirm(`Deseja realmente apagar ${nome}?`);
    if (!confirmado) {
      return;
    }

    this._usuariosService.ExcluirUsuarios(row.id).subscribe({
      next: () => {
        this.svc = (this.svc || []).filter(
          (usuario: UserData) => String(usuario?.id) !== String(row.id)
        );
        this.dataSource.data = this.svc;
      },
      error: (erro: any) => {
        const erroApi = `${erro?.error?.error ?? ''}`.trim();
        const mensagem = erroApi === 'ERR_REPRESENTANTE_COM_FARMACIAS_VINCULADAS'
          ? 'Não foi possível apagar o usuário: existem drogarias vinculadas a este representante.'
          : erroApi || 'Não foi possível apagar o usuário.';
        alert(mensagem);
      },
    });
  }

  getPerfilLabel(row: UserData): string {
    const perfil = `${row?.perfil ?? row?.profile ?? row?.funcao_departamento ?? ''}`.trim().toLowerCase();

    if (perfil === 'gerenciador') {
      return 'Gerenciador';
    }

    if (perfil === 'comercial') {
      return 'Comercial';
    }

    if (perfil === 'representante') {
      return 'Representante';
    }

    return perfil ? perfil.charAt(0).toUpperCase() + perfil.slice(1) : 'Representante';
  }

}
