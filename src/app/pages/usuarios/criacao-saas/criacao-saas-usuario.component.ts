import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import {
  UserCreatePayload,
  UsersSaasService,
} from 'src/app/services/users-saas/users-saas.service';

@Component({
  selector: 'front-zapfarma-criacao-saas-usuario',
  standalone: true,
  templateUrl: './criacao-saas-usuario.component.html',
  styleUrls: ['./criacao-saas-usuario.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    frontZapFarmaMenuComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
})
export class CriacaoSaasUsuarioComponent {
  form: FormGroup;
  submitting = false;
  sucesso = false;
  submitError: string | null = null;
  hidePassword = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usersSaasService: UsersSaasService,
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      login: ['', [Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      companyId: [null, [Validators.min(1)]],
      token: [''],
      profile: ['admin', [Validators.maxLength(40)]],
      queueIdsText: [''],
      whatsappId: [null, [Validators.min(1)]],
      allTicket: ['disabled'],
    });

    this.aplicarValidacoesPorEndpoint();
  }

  get f() {
    return this.form.controls;
  }

  get usarEndpointPrivado(): boolean {
    return Boolean(
      this.usuariosService.logado &&
        (this.usuariosService.obterUsuarioAdminLogado ||
          this.usuariosService.obterUsuarioAdminSysLogado)
    );
  }

  cadastrarUsuario() {
    this.submitError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.usersSaasService
      .criarUsuario(this.montarPayload(), this.usarEndpointPrivado)
      .subscribe({
        next: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.sucesso = true;
          this.submitting = false;
        },
        error: (erro: any) => {
          this.submitError = this.extrairMensagemErro(erro);
          this.submitting = false;
        },
      });
  }

  voltar() {
    this.router.navigate(['/usuarios-afiliados']);
  }

  criarOutroUsuario() {
    this.sucesso = false;
    this.submitError = null;
    this.form.reset({
      name: '',
      email: '',
      login: '',
      password: '',
      companyId: null,
      token: '',
      profile: 'admin',
      queueIdsText: '',
      whatsappId: null,
      allTicket: 'disabled',
    });
    this.aplicarValidacoesPorEndpoint();
  }

  private aplicarValidacoesPorEndpoint() {
    const tokenControl = this.form.get('token');
    const companyControl = this.form.get('companyId');

    if (!tokenControl || !companyControl) {
      return;
    }

    if (this.usarEndpointPrivado) {
      tokenControl.clearValidators();
      companyControl.setValidators([Validators.min(1)]);
    } else {
      tokenControl.setValidators([Validators.required, Validators.minLength(3)]);
      companyControl.setValidators([Validators.required, Validators.min(1)]);
    }

    tokenControl.updateValueAndValidity({ emitEvent: false });
    companyControl.updateValueAndValidity({ emitEvent: false });
  }

  private montarPayload(): UserCreatePayload {
    const valorBruto = this.form.getRawValue();
    const payload: UserCreatePayload = {
      name: `${valorBruto.name}`.trim(),
      email: `${valorBruto.email}`.trim().toLowerCase(),
      password: `${valorBruto.password}`,
      profile: `${valorBruto.profile ?? 'admin'}`.trim() || 'admin',
      allTicket: `${valorBruto.allTicket ?? 'disabled'}`.trim() || 'disabled',
    };

    const login = `${valorBruto.login ?? ''}`.trim().toLowerCase();
    payload.login = login || payload.email;

    const queueIds = this.parseQueueIds(valorBruto.queueIdsText);
    if (queueIds.length) {
      payload.queueIds = queueIds;
    }

    const whatsappId = Number(valorBruto.whatsappId);
    if (!Number.isNaN(whatsappId) && whatsappId > 0) {
      payload.whatsappId = whatsappId;
    }

    const companyId = Number(valorBruto.companyId);
    if (!Number.isNaN(companyId) && companyId > 0) {
      payload.companyId = companyId;
    }

    if (!this.usarEndpointPrivado) {
      payload.token = `${valorBruto.token ?? ''}`.trim();
    }

    return payload;
  }

  private parseQueueIds(queueIdsText: unknown): number[] {
    const ids = `${queueIdsText ?? ''}`
      .split(/[;,\s]+/)
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);

    return ids.filter((item, index) => ids.indexOf(item) === index);
  }

  private extrairMensagemErro(erro: any): string {
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

    return 'Não foi possível criar o usuário. Verifique os dados e tente novamente.';
  }
}
