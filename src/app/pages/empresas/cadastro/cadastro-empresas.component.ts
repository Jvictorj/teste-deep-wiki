import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
// import { validate } from 'gerador-validador-cpf';
import { MatSelect } from '@angular/material/select';
import { catchError, of } from 'rxjs';
import { validate, format, generate } from 'cnpj';
import { CepsService } from 'src/app/services/ceps/ceps.service';

export interface CEP {
  cidade: string;
  uf: string;
  logradouro?: string;
  tipo_logradouro?: string;
  bairro: string;
}

@Component({
  selector: 'front-zapfarma-cadastro-empresas',
  templateUrl: './cadastro-empresas.component.html',
  styleUrls: ['./cadastro-empresas.component.scss'],
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
    MatSelect,
    MatOptionModule,
  ],
  providers: [FarmaciasService, CepsService, provideNgxMask()],
})
export class CadastroEmpresasComponent {
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
    private _farmaciasService: FarmaciasService,
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
    this.router.navigate(['/login']);
  }

  voltar() {
    if(!this.error) {
      this.router.navigate(['/empresas'])
    }
    else {
      window.location.reload();
    }
  }

  criarForm() {
    this.formLogin = this.formBuilder.group({
      nomeFantasia: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150),
      ]),
      razaoSocial: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
      ]),
      cpfCnpj: new FormControl(null, [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
      ]),
      telefone: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      whatsApp: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      whatsAppsExtras: this.formBuilder.array([]),
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
      plano: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ]),
      responsavel: ['', []],
      numeroResponsavel: ['', []],
      horarioAtendimento: ['', []],
      // 'senha': new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(15)]),
    });
  }

  get whatsAppsExtras(): FormArray {
    return this.formLogin.get('whatsAppsExtras') as FormArray;
  }

  addWhatsAppExtra() {
    this.whatsAppsExtras.push(new FormControl(''));
  }

  removeWhatsAppExtra(index: number) {
    this.whatsAppsExtras.removeAt(index);
  }

  validateDvCpf(): void {
    const cpfCnpj = this.formLogin.controls['cpfCnpj'].value;
    const formatted = format(cpfCnpj)
    const v = validate(formatted);
    if (!v && cpfCnpj != null) {
      this.openDialogCpfDV();
      this.formLogin.controls['cpfCnpj'].reset();
      document.getElementById('cpfCnpj')?.focus();
    }
  }

  validarCPfUsuario() {
    const cpfCnpj = this.formLogin.controls['cpfCnpj'].value;
    this._farmaciasService.consultarFarmaciasPorCnpj(cpfCnpj).subscribe((ret) => {
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
    alert('CNPJ incorreto!');
  }

  openDialogCPF() {
    alert('Este CNPJ já foi cadastrado');
  }

  cadastrar() {
    // this.btnDisable = true
    if (this.formLogin.valid && this.validCpf == true) {
      const payload = { ...this.formLogin.value } as any;
      const extras = (payload.whatsAppsExtras || []) as string[];
      const numerosWhatsapp = [payload.whatsApp, ...extras]
        .map((numero: string) => (numero || '').trim())
        .filter((numero: string) => numero.length > 0);

      payload.whatsApp = numerosWhatsapp.join(' | ');
      delete payload.whatsAppsExtras;

      this._farmaciasService
        .AdicionarFarmacias(payload)
        .pipe(
          catchError((ret) => {
            this.sucesso = false;
            this.error = ret.error.error;
            return of(false);
          })
        )
        .subscribe((ret: any) => {
          if (!ret) {
            return;
          }

          window.scrollTo({top:0, behavior: 'smooth'});
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
}
