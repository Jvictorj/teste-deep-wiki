import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { validate } from 'gerador-validador-cpf';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { CepsService } from 'src/app/services/ceps/ceps.service';

export interface CEPResponse {
  cidade: string;
  uf: string;
  logradouro?: string;
  tipo_logradouro?: string;
  bairro: string;
}

@Component({
  selector: 'front-zapfarma-cadastro-afiliados',
  templateUrl: './cadastro-afiliados.component.html',
  styleUrls: ['./cadastro-afiliados.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    frontZapFarmaMenuComponent,
    ReactiveFormsModule,
    NgxMaskDirective,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [UsuariosService, CepsService, provideNgxMask()],
})
export class CadastroAfiliadosComponent {
  formCadastro: FormGroup;
  validCpf = true;
  onSubmitValidate = false;
  btnDisable = false;
  sucesso = false;
  error: any;
  hideSenha = true;
  readonly perfilOptions = [
    { value: 'representante', label: 'Representante' },
    { value: 'gerenciador', label: 'Gerenciador' },
    { value: 'comercial', label: 'Comercial' },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private cepsService: CepsService
  ) {
    this.formCadastro = this.formBuilder.group({
      cpfCnpj: new FormControl(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      nome: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150),
      ]),
      telefone: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(200),
      ]),
      login: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      perfil: new FormControl(null, [Validators.required]),
      cep: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(9),
      ]),
      endereco: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      bairro: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120),
      ]),
      cidade: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
      ]),
      estado: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
      ]),
      senha: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }

  voltar() {
    if (!this.error) {
      this.router.navigate(['/usuarios-afiliados']);
      return;
    }
    window.location.reload();
  }

  exibirSenha() {
    this.hideSenha = !this.hideSenha;
  }

  validateDvCpf(): void {
    const cpfInformado = (this.formCadastro.controls['cpfCnpj'].value || '').replace(/\D/g, '');
    let valido = true;

    if (cpfInformado.length === 11) {
      valido = validate(cpfInformado);
    }

    if (!valido && cpfInformado) {
      alert('CPF incorreto!');
      this.formCadastro.controls['cpfCnpj'].reset();
      document.getElementById('cpfCnpj')?.focus();
    }
  }

  validarCPfUsuario() {
    const cpfInformado = this.formCadastro.controls['cpfCnpj'].value;
    if (!cpfInformado) {
      return;
    }

    this.usuariosService
      .consultaCpfUsuario(cpfInformado)
      .pipe(
        catchError(() => {
          this.validCpf = true;
          return of(null);
        })
      )
      .subscribe((ret: any) => {
        if (ret && Object.keys(ret).length > 0) {
          this.validCpf = false;
          alert('Este CPF já foi cadastrado');
          this.formCadastro.controls['cpfCnpj'].reset();
          document.getElementById('cpfCnpj')?.focus();
          return;
        }
        this.validCpf = true;
      });
  }

  cadastrar() {
    if (!this.formCadastro.valid || this.validCpf !== true || this.btnDisable) {
      return;
    }

    this.btnDisable = true;
    const payload = {
      ...this.formCadastro.value,
    };
    payload.login = `${payload.login ?? ''}`.trim().toLowerCase();

    this.usuariosService
      .AdicionarUsuarios(payload)
      .pipe(
        catchError((ret) => {
          this.error = ret?.error?.error || 'Não foi possível cadastrar o usuário.';
          this.sucesso = true;
          this.onSubmitValidate = true;
          this.btnDisable = false;
          return of(null);
        })
      )
      .subscribe((ret) => {
        if (!ret) {
          return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.sucesso = true;
        this.onSubmitValidate = true;
        this.formCadastro.reset();
        this.btnDisable = false;
      });
  }

  consutarEndereco() {
    const cep = (this.formCadastro.value['cep'] || '').replace(/\D/g, '');
    if (!cep) {
      return;
    }

    this.cepsService.consultarCep(cep).subscribe((response: any) => {
      const dadosCep: CEPResponse | undefined = response?.result?.[0];
      if (!dadosCep) {
        return;
      }

      const endereco =
        [dadosCep.tipo_logradouro, dadosCep.logradouro]
          .filter((item) => !!item)
          .join(' ')
          .trim() || '';

      this.formCadastro.patchValue({
        endereco,
        bairro: dadosCep.bairro || '',
        cidade: dadosCep.cidade || '',
        estado: (dadosCep.uf || '').toUpperCase(),
      });
    });
  }
}
