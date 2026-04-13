import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { validate } from 'gerador-validador-cpf';
import { MatSelect } from '@angular/material/select';
import { catchError, map, of, switchMap } from 'rxjs';
import { CepsService } from 'src/app/services/ceps/ceps.service';


export interface CEP {
  cidade: string;
  uf: string;
  logradouro?: string;
  tipo_logradouro?: string;
  bairro: string;
}


@Component({
  selector: 'front-zapfarma-editar-empresas',
  templateUrl: './editar-empresas.component.html',
  styleUrls: ['./editar-empresas.component.scss'],
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
    MatOptionModule

  ],
  providers: [FarmaciasService, CepsService, provideNgxMask(),],
  
})
export class EditarEmpresasComponent {
    formLogin!: FormGroup;
    validCpf = true;
    onSubmitValidate = false;
    btnDisable = false;
    sucesso = false;
    error:any
    cep!: CEP;
    _id: any;
    farmacia!: any;
  
  
    constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private _farmaciasService: FarmaciasService,
      private _UsuariosService: UsuariosService,
      private routerActivate: ActivatedRoute,
      private _cepsService: CepsService

  
    ) { 

      this.criarForm();
      this.cep = {
        cidade:'',
        bairro: '',
        uf: '',
        tipo_logradouro: '',
        logradouro: ''
      }

      this.routerActivate.queryParamMap.subscribe((params) => {
        this._id = params.get('id');
        this.getFarmacias();
      });

    }
  
  
    login() {
      this.router.navigate(['/login'])
    }
  
    voltar() {
      if(!this.error) {
        this.router.navigate(['/empresas'])
      }
      else {
        window.location.reload();
      }
    }
  
    
    criarForm(){
      this.formLogin = this.formBuilder.group({
        'id': new FormControl(null,[ Validators.required,Validators.minLength(1),Validators.maxLength(150)]),
        'idRepresentantes': new FormControl(null,[ Validators.required,Validators.minLength(1),Validators.maxLength(150)]),
        'nomeFantasia': new FormControl(null,[ Validators.required,Validators.minLength(5),Validators.maxLength(150)]),
        'razaoSocial': new FormControl(null,[ Validators.required,Validators.minLength(5),Validators.maxLength(150)]),
        'email': new FormControl(null, [ Validators.required,Validators.minLength(1),Validators.maxLength(200)]),
        'cpfCnpj': new FormControl(null,[Validators.required, Validators.minLength(10),Validators.maxLength(14)]),
        'telefone': new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(15)]),
        'whatsApp': new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(15)]),
        'cep' :new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(200)]),
        'endereco' :new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(200)]),
        'estado': new FormControl(null, [Validators.required, Validators.minLength(2),Validators.maxLength(2)]),
        'cidade': new FormControl(null, [Validators.required, Validators.minLength(2),Validators.maxLength(150)]),
        'bairro': new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(15)]),
        'plano': new FormControl(null, [Validators.required, Validators.minLength(1),Validators.maxLength(2)]),
        'responsavel': ['', []],
        'horarioAtendimento': ['', []],
        // 'senha': new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(15)]),
      });
    }
  
    validateDvCpf():void {
      const cpfInformado = `${this.formLogin.controls['cpfCnpj'].value ?? ''}`.replace(/\D/g, '');
      let valido = true;

      if (cpfInformado.length === 11) {
        valido = validate(cpfInformado);
      }

      if (!valido && cpfInformado) {
        this.openDialogCpfDV()
        this.formLogin.controls['cpfCnpj'].reset();
        document.getElementById("cpfCnpj")?.focus();
      }
    }
  
    validarCPfUsuario() {
      const cpfInformado = this.formLogin.controls['cpfCnpj'].value;
      if (!cpfInformado) {
        return;
      }

        this._UsuariosService.consultaCpfUsuario(cpfInformado)
          .subscribe(ret => { 
            if (Object.keys(ret).length > 0 ) {
              this.validCpf = false
              this.openDialogCPF();
              this.formLogin.controls['cpfCnpj'].reset();
              document.getElementById("cpfCnpj")?.focus();
            }
            else {
              this.validCpf = true
            }
            });
    }
  
    openDialogCpfDV() {
      alert("CPF incorreto!")
    }
  
    openDialogCPF() {
      alert("Este CPF já foi cadastrado")
    }
  
    atualizar() {
      // this.btnDisable = true
      if (this.formLogin.valid && this.validCpf == true) {
        this._farmaciasService.AtualizarFarmacias(this.formLogin.value, this._id)
        .pipe(
          catchError((ret) => {
            this.sucesso = false;
            this.error = ret.error.error
            return of(false);
          })
        )
        .subscribe(ret =>
          { 
          window.scrollTo({top:0, behavior: 'smooth'});
          this.sucesso = true;
          this.onSubmitValidate = true;
          this.formLogin.reset();
          this.btnDisable = false;
          }
          );
      }
      else {
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

    getFarmacias(): void {
        if (!this._id) {
          return;
        }

        this._farmaciasService
          .consultarFarmaciasId(this._id)
          .pipe(
            catchError(() => of(null)),
            switchMap((svc: any) => {
              const farmaciaDireta = this.extrairFarmaciaDaResposta(svc);
              if (farmaciaDireta) {
                return of(farmaciaDireta);
              }

              const idUsuarioLogado = this._UsuariosService.obterIdUsuarioLogado;
              const consultaFallback$ = this._UsuariosService.podeGerenciarTudoLogado
                ? this._farmaciasService.consultarFarmacias()
                : this._farmaciasService.consultarFarmaciasAfiliadosCPF(
                    `${idUsuarioLogado ?? ''}`.trim()
                  );

              return consultaFallback$.pipe(
                map((respostaFallback: any) =>
                  this.encontrarFarmaciaPorId(respostaFallback, this._id)
                ),
                catchError(() => of(null))
              );
            })
          )
          .subscribe((farmacia: any) => {
            this.farmacia = farmacia || null;
            this.preencherFormularioComFarmacia(this.farmacia);
          });
    }

    private extrairFarmaciaDaResposta(resposta: any): any {
      if (!resposta) {
        return null;
      }

      const farmaciaRetorno =
        resposta?.farmacia ??
        resposta?.farmacias ??
        resposta?.data?.farmacia ??
        resposta?.data?.farmacias ??
        resposta?.data ??
        resposta?.result ??
        resposta;

      if (Array.isArray(farmaciaRetorno)) {
        return farmaciaRetorno[0] || null;
      }

      return farmaciaRetorno || null;
    }

    private normalizarListaFarmacias(resposta: any): any[] {
      if (!resposta) {
        return [];
      }

      if (Array.isArray(resposta)) {
        return resposta;
      }

      if (Array.isArray(resposta?.farmacias)) {
        return resposta.farmacias;
      }

      if (Array.isArray(resposta?.data?.farmacias)) {
        return resposta.data.farmacias;
      }

      if (Array.isArray(resposta?.data)) {
        return resposta.data;
      }

      if (Array.isArray(resposta?.result)) {
        return resposta.result;
      }

      return [];
    }

    private encontrarFarmaciaPorId(resposta: any, id: any): any {
      const lista = this.normalizarListaFarmacias(resposta);
      const idNormalizado = `${id ?? ''}`.trim();

      return (
        lista.find(
          (farmacia: any) => `${farmacia?.id ?? farmacia?._id ?? ''}`.trim() === idNormalizado
        ) || null
      );
    }

    private preencherFormularioComFarmacia(farmacia: any): void {
      if (!farmacia) {
        return;
      }

      const obterCampo = (...campos: string[]) => {
        for (const campo of campos) {
          const valor = farmacia?.[campo];
          if (valor !== undefined && valor !== null && valor !== '') {
            return valor;
          }
        }
        return null;
      };

      const valorPlano = obterCampo('plano', 'idPlanos', 'id_planos');
      const planoNormalizado =
        valorPlano !== null && valorPlano !== undefined && valorPlano !== ''
          ? Number(valorPlano)
          : null;

      this.formLogin.patchValue({
        id: obterCampo('id') ?? this._id ?? null,
        idRepresentantes:
          obterCampo('idRepresentantes', 'idCriador', 'id_representantes') ??
          this._UsuariosService.obterIdUsuarioLogado ??
          null,
        nomeFantasia: obterCampo('nomeFantasia', 'nome_fantasia') ?? '',
        razaoSocial: obterCampo('razaoSocial', 'razao_social') ?? '',
        email: obterCampo('email') ?? '',
        cpfCnpj: obterCampo('cpfCnpj', 'cpf_cnpj') ?? '',
        telefone: obterCampo('telefone') ?? '',
        whatsApp: obterCampo('whatsApp', 'whatsapp', 'whats_app') ?? '',
        cep: obterCampo('cep') ?? '',
        endereco: obterCampo('endereco', 'logradouro') ?? '',
        estado: obterCampo('estado', 'uf') ?? '',
        cidade: obterCampo('cidade') ?? '',
        bairro: obterCampo('bairro') ?? '',
        plano: Number.isNaN(planoNormalizado as number) ? valorPlano : planoNormalizado,
        responsavel: obterCampo('responsavel') ?? '',
        horarioAtendimento:
          obterCampo('horarioAtendimento', 'horario_atendimento') ?? '',
      });
    }
  
  
}
