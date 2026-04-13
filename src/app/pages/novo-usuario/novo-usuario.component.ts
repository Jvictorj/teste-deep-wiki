import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { validate } from 'gerador-validador-cpf';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { catchError, of } from 'rxjs';
import { CepsService } from 'src/app/services/ceps/ceps.service';

export interface CEP {
  cidade: string;
  uf: string;
  logradouro?: string;
  tipo_logradouro?: string;
  bairro: string;
}
@Component({
  selector: 'front-zapfarma-novo-usuario',
  templateUrl: './novo-usuario.component.html',
  styleUrls: ['./novo-usuario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    frontZapFarmaHeaderComponent,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask(), CepsService, UsuariosService, HttpClient],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NovoUsuarioComponent {
  formLogin: FormGroup;
  validCpf = true;
  onSubmitValidate = false;
  btnDisable = false;
  sucesso = false;
  cep!: CEP;
  error:any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _UsuariosService: UsuariosService,
    private _cepsService: CepsService
    
  ) {
    this.criarForm();
    this.cep = {
      cidade: '',
      bairro: '',
      uf: '',
      tipo_logradouro: '',
      logradouro: '',
    };
  }

  login() {
    if(!this.error) {
      this.router.navigate(['/login'])
    }
    else {
      window.location.reload();
    }
  }

  acessar() {
    this.router.navigate(['/empresas']);
  }

  criarForm() {
    this.formLogin = this.formBuilder.group({
      nome: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
      ]),
      login: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      cpfCnpj: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(14),
      ]),
      telefone: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      cep: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      endereco: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      estado: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
      ]),
      cidade: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
      ]),
      bairro: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      senha: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
    });
  }

  validateDvCpf(): void {
    const cpfInformado = this.formLogin.controls['cpfCnpj'].value;
    let v = true
    if(cpfInformado.length === 11) {
      v = validate(cpfInformado);
    }
    if (!v && cpfInformado != null) {
      this.openDialogCpfDV();
      this.formLogin.controls['cpfCnpj'].reset();
      document.getElementById('cpfCnpj')?.focus();
    }
  }

  validarCPfUsuario() {
    const cpfInformado = this.formLogin.controls['cpfCnpj'].value;
    this._UsuariosService.consultaCpfUsuario(cpfInformado)
    .pipe(
      catchError((ret) => {
        // this.sucesso = false;
        this.validCpf = true;        
        return of(false);
      })
    )
    .subscribe((ret) => {
      if (Object.keys(ret).length > 0) {
        this.validCpf = false;
        this.openDialogCPF();
        this.formLogin.controls['cpfCnpj'].reset();
        document.getElementById('cpfCnpj')?.focus();
      } else {
        this.validCpf = true;
      }
    });
  }

  openDialogCpfDV() {
    alert('CPF incorreto!');
  }

  openDialogCPF() {
    alert('Este CPF já foi cadastrado');
  }

  cadastrar() {
    // this.btnDisable = true
    if (this.formLogin.valid && this.validCpf == true) {
      const payload = {
        ...this.formLogin.value,
        login: `${this.formLogin.value?.login ?? ''}`.trim().toLowerCase(),
      };
      this._UsuariosService
        .AdicionarUsuarios(payload)
        .pipe(
          catchError((ret) => {
            // this.sucesso = false;
            this.error = ret.error.error;
            return of(false);
          })
        )
        .subscribe((ret) => {
          this.sucesso = true;
          this.onSubmitValidate = true;
          this.formLogin.reset();
          this.btnDisable = false;
        });
    } else {
      // this.invalidCampos = true
    }
  }

  consutarEndereco() {
    const cep = this.formLogin.value['cep'];
    if (cep) {
      this._cepsService.consultarCep(cep).subscribe((response: any) => {
        this.cep = response.result[0];
        this.cep.logradouro = response.result[0].tipo_logradouro + ' ' +  response.result[0].logradouro
      });
    } else {
      // this.invalidCampos = true
    }
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
