import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';
import {
  CompaniesService,
  CompanyCreatePayload,
} from 'src/app/services/companies/companies.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import {
  UserCreatePayload,
  UsersSaasService,
} from 'src/app/services/users-saas/users-saas.service';
import { firstValueFrom } from 'rxjs';

const BR_DATE_FORMATS = {
  parse: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: { day: '2-digit', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};

interface SaasCriadoRegistro {
  createdAt: string;
  companyId?: number | null;
}

interface UsuarioCriadoCredencial {
  nome: string;
  login: string;
  senha: string;
}

@Component({
  selector: 'front-zapfarma-criacao-saas-empresa',
  standalone: true,
  templateUrl: './criacao-saas-empresa.component.html',
  styleUrls: ['./criacao-saas-empresa.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    frontZapFarmaMenuComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective,
  ],
  providers: [
    provideNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: BR_DATE_FORMATS },
  ],
})
export class CriacaoSaasEmpresaComponent {
  form: FormGroup;
  userForm: FormGroup;
  submitting = false;
  sucesso = false;
  submitError: string | null = null;
  userSucesso = false;
  userSubmitError: string | null = null;
  userResultadoResumo = '';
  usuariosCriadosCredenciais: UsuarioCriadoCredencial[] = [];
  hideUserPassword = true;
  endpointUtilizado = '/companies/cadastro';
  drogariaOrigem = '';
  idFarmaciaOrigem = '';
  private readonly saasEmpresasCriadasStorageKey = 'zapfarma.saas.empresas-criadas';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly companiesService: CompaniesService,
    private readonly usersSaasService: UsersSaasService,
    private readonly usuariosService: UsuariosService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('pt-BR');

    this.form = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
      ],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      planId: [null, [Validators.min(1)]],
      status: [null],
      phone: ['', [Validators.maxLength(20), this.phoneOpcionalValidator]],
      dueDate: [null],
      recurrence: [''],
      address: ['', [Validators.maxLength(255)]],
      responsible: ['', [Validators.maxLength(150)]],
      cnpj: ['', [this.cnpjOpcionalValidator]],
      campaignsEnabled: [null],
    });
    this.userForm = this.formBuilder.group({
      token: [''],
      users: this.formBuilder.array([this.criarLinhaUsuario()]),
    });

    this.endpointUtilizado = this.usarEndpointPrivado
      ? '/companies'
      : '/companies/cadastro';
    this.aplicarValidacoesUsuarioPorEndpoint();

    const drogaria = `${this.route.snapshot.queryParamMap.get('drogaria') ?? ''}`
      .trim();
    this.idFarmaciaOrigem = `${this.route.snapshot.queryParamMap.get('idFarmacia') ?? ''}`.trim();

    if (drogaria) {
      this.drogariaOrigem = drogaria;
      this.form.patchValue({ name: drogaria });
    }
  }

  get f() {
    return this.form.controls;
  }

  get uf() {
    return this.userForm.controls;
  }

  get usersArray(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  get usarEndpointPrivado(): boolean {
    return Boolean(
      this.usuariosService.logado && this.usuariosService.obterUsuarioAdminSysLogado
    );
  }

  get usarEndpointPrivadoUsuario(): boolean {
    return Boolean(
      this.usuariosService.logado &&
        (this.usuariosService.obterUsuarioAdminLogado ||
          this.usuariosService.obterUsuarioAdminSysLogado)
    );
  }

  async cadastrarEmpresa() {
    if (this.submitting) {
      return;
    }

    this.submitError = null;
    this.userSubmitError = null;
    this.userResultadoResumo = '';
    this.usuariosCriadosCredenciais = [];

    if (this.form.invalid || this.userForm.invalid) {
      this.form.markAllAsTouched();
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    try {
      const resposta = await firstValueFrom(
        this.companiesService.criarEmpresa(this.montarPayload(), this.usarEndpointPrivado)
      );
      const companyIdCriada = this.extrairCompanyId(resposta);

      if (!companyIdCriada) {
        throw new Error(
          'Empresa criada, mas não foi possível identificar o Company ID retornado para cadastrar usuários.'
        );
      }

      const payloads = this.montarPayloadUsuarios(companyIdCriada);
      let sucessoCount = 0;
      const erros: string[] = [];

      for (let i = 0; i < payloads.length; i += 1) {
        const payload = payloads[i];
        try {
          await firstValueFrom(
            this.usersSaasService.criarUsuario(
              payload,
              this.usarEndpointPrivadoUsuario
            )
          );
          sucessoCount += 1;
          this.usuariosCriadosCredenciais.push({
            nome: payload.name || `Usuário ${i + 1}`,
            login: payload.login || payload.email,
            senha: payload.password || '',
          });
        } catch (erro: any) {
          const identificador = payload.email || payload.name || `Usuário ${i + 1}`;
          const mensagemErro = this.extrairMensagemErro(
            erro,
            'Não foi possível criar o usuário.'
          );
          erros.push(`${identificador}: ${mensagemErro}`);
        }
      }

      this.marcarSaasCriadoLocal(companyIdCriada);
      this.sucesso = true;
      this.userSucesso = sucessoCount === payloads.length;
      this.userResultadoResumo = `${sucessoCount} de ${payloads.length} usuário(s) criados.`;
      this.userSubmitError = erros.length ? erros.join(' | ') : null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (erro: any) {
      this.submitError = this.extrairMensagemErro(
        erro,
        'Não foi possível criar a empresa e os usuários. Verifique os dados e tente novamente.'
      );
      this.userSucesso = false;
      this.userResultadoResumo = '';
      this.userSubmitError = null;
      this.usuariosCriadosCredenciais = [];
    } finally {
      this.submitting = false;
    }
  }

  voltar() {
    this.router.navigate(['/empresas']);
  }

  criarOutraEmpresa() {
    const nomeOrigem = this.drogariaOrigem || '';
    this.sucesso = false;
    this.submitError = null;
    this.form.reset({
      name: nomeOrigem,
      email: '',
      planId: null,
      status: null,
      phone: '',
      dueDate: null,
      recurrence: '',
      address: '',
      responsible: '',
      cnpj: '',
      campaignsEnabled: null,
    });
    this.criarOutroUsuario();
  }

  criarOutroUsuario() {
    this.userSucesso = false;
    this.userSubmitError = null;
    this.userResultadoResumo = '';
    this.usuariosCriadosCredenciais = [];
    this.userForm.reset({
      token: '',
    });
    while (this.usersArray.length > 0) {
      this.usersArray.removeAt(0);
    }
    this.usersArray.push(this.criarLinhaUsuario());
    this.aplicarValidacoesUsuarioPorEndpoint();
  }

  adicionarUsuarioLinha() {
    this.usersArray.push(this.criarLinhaUsuario());
    this.aplicarValidacoesUsuarioPorEndpoint();
  }

  removerUsuarioLinha(index: number) {
    if (this.usersArray.length === 1) {
      return;
    }
    this.usersArray.removeAt(index);
  }

  private montarPayload(): CompanyCreatePayload {
    const valorBruto = this.form.getRawValue();
    const payload: CompanyCreatePayload = {
      name: `${valorBruto.name}`.trim(),
    };

    const email = `${valorBruto.email ?? ''}`.trim();
    if (email) {
      payload.email = email;
    }

    const planId = Number(valorBruto.planId);
    if (!Number.isNaN(planId) && planId > 0) {
      payload.planId = planId;
    }

    if (typeof valorBruto.status === 'boolean') {
      payload.status = valorBruto.status;
    }

    const phone = this.toDigits(valorBruto.phone);
    if (phone) {
      payload.phone = phone;
    }

    const dueDate = this.formatarDataVencimento(valorBruto.dueDate);
    if (dueDate) {
      payload.dueDate = dueDate;
    }

    const recurrence = `${valorBruto.recurrence ?? ''}`.trim();
    if (recurrence) {
      payload.recurrence = recurrence;
    }

    const address = `${valorBruto.address ?? ''}`.trim();
    if (address) {
      payload.address = address;
    }

    const responsible = `${valorBruto.responsible ?? ''}`.trim();
    if (responsible) {
      payload.responsible = responsible;
    }

    const cnpj = this.toDigits(valorBruto.cnpj);
    if (cnpj) {
      payload.cnpj = cnpj;
    }

    if (typeof valorBruto.campaignsEnabled === 'boolean') {
      payload.campaignsEnabled = valorBruto.campaignsEnabled;
    }

    return payload;
  }

  private formatarDataVencimento(valor: unknown): string {
    if (!valor) {
      return '';
    }

    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
      const ano = valor.getFullYear();
      const mes = `${valor.getMonth() + 1}`.padStart(2, '0');
      const dia = `${valor.getDate()}`.padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    }

    const dataTexto = `${valor}`.trim();
    if (!dataTexto) {
      return '';
    }

    const dataPtBr = dataTexto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dataPtBr) {
      const [, dia, mes, ano] = dataPtBr;
      return `${ano}-${mes}-${dia}`;
    }

    const dataIso = dataTexto.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dataIso) {
      return dataIso[1];
    }

    return dataTexto;
  }

  private montarPayloadUsuarios(companyIdForcado: number): UserCreatePayload[] {
    const valorBruto = this.userForm.getRawValue();
    const token = `${valorBruto.token ?? ''}`.trim();

    const usuarios = (valorBruto.users || []) as Array<{
      name: string;
      email: string;
      login?: string;
      password: string;
      profile?: string;
      allTicket?: string;
    }>;

    return usuarios.map((usuario) => {
      const email = `${usuario.email ?? ''}`.trim().toLowerCase();
      const login = `${usuario.login ?? ''}`.trim().toLowerCase();
      const allTicket = `${usuario.allTicket ?? 'disabled'}`.trim() || 'disabled';
      const payload: UserCreatePayload = {
        name: `${usuario.name ?? ''}`.trim(),
        email,
        login: login || email,
        password: `${usuario.password ?? ''}`,
        profile: `${usuario.profile ?? 'admin'}`.trim() || 'admin',
        allTicket,
      };

      payload.companyId = companyIdForcado;

      if (!this.usarEndpointPrivadoUsuario && token) {
        payload.token = token;
      }

      return payload;
    });
  }

  private aplicarValidacoesUsuarioPorEndpoint() {
    const tokenControl = this.userForm.get('token');

    if (!tokenControl) {
      return;
    }

    if (this.usarEndpointPrivadoUsuario) {
      tokenControl.clearValidators();
    } else {
      tokenControl.setValidators([Validators.required, Validators.minLength(3)]);
    }

    tokenControl.updateValueAndValidity({ emitEvent: false });
  }

  private extrairMensagemErro(erro: any, fallback = 'Não foi possível concluir a operação.'): string {
    const origem = erro?.error;

    if (typeof origem === 'string' && origem.trim()) {
      return origem;
    }

    if (typeof origem?.error === 'string' && origem.error.trim()) {
      return origem.error;
    }

    if (typeof origem?.message === 'string' && origem.message.trim()) {
      return origem.message;
    }

    if (Array.isArray(origem?.message) && origem.message.length > 0) {
      return origem.message.join(' | ');
    }

    return fallback;
  }

  private toDigits(value: string | null | undefined): string {
    return `${value ?? ''}`.replace(/\D/g, '');
  }

  private criarLinhaUsuario(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      login: ['', [Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      profile: ['admin', [Validators.maxLength(40)]],
      allTicket: ['disabled'],
    });
  }

  private extrairCompanyId(resposta: any): number | null {
    const candidatos = [
      resposta?.id,
      resposta?.companyId,
      resposta?._id,
      resposta?.company?.id,
      resposta?.company?.companyId,
      resposta?.data?.id,
      resposta?.data?.companyId,
      resposta?.data?.company?.id,
      resposta?.result?.id,
    ];

    for (const candidato of candidatos) {
      const id = Number(candidato);
      if (!Number.isNaN(id) && id > 0) {
        return id;
      }
    }

    return null;
  }

  private marcarSaasCriadoLocal(companyIdCriada: number): void {
    if (!this.idFarmaciaOrigem) {
      return;
    }

    const mapa = this.obterMapaSaasEmpresasCriadas();
    const chave = `id:${this.idFarmaciaOrigem}`;

    mapa[chave] = {
      createdAt: new Date().toISOString(),
      companyId: companyIdCriada,
    };

    localStorage.setItem(this.saasEmpresasCriadasStorageKey, JSON.stringify(mapa));
  }

  private obterMapaSaasEmpresasCriadas(): Record<string, SaasCriadoRegistro> {
    const bruto = localStorage.getItem(this.saasEmpresasCriadasStorageKey);

    if (!bruto) {
      return {};
    }

    try {
      return JSON.parse(bruto);
    } catch {
      return {};
    }
  }

  private cnpjOpcionalValidator(control: AbstractControl): ValidationErrors | null {
    const digits = `${control.value ?? ''}`.replace(/\D/g, '');
    if (!digits) {
      return null;
    }

    return digits.length === 14 ? null : { cnpjInvalido: true };
  }

  private phoneOpcionalValidator(control: AbstractControl): ValidationErrors | null {
    const digits = `${control.value ?? ''}`.replace(/\D/g, '');
    if (!digits) {
      return null;
    }

    return digits.length >= 10 ? null : { telefoneInvalido: true };
  }
}
