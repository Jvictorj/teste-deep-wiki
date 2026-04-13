import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToolbarComponent } from '../../shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'front-zapfarma-coex-api-oficial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    ToolbarComponent,
    RodapeComponent,
  ],
  templateUrl: './coex-api-oficial.component.html',
  styleUrls: ['./coex-api-oficial.component.scss'],
  providers: [provideNgxMask()],
})
export class CoexApiOficialComponent {
  readonly formulario: FormGroup;
  submitting = false;
  submitSuccess = false;
  dadosEnviados: Record<string, unknown> | null = null;
  termosCoexistenciaLiberado = false;
  private readonly whatsappSuporte = '552135205492';

  constructor(private readonly fb: FormBuilder) {
    this.formulario = this.fb.group({
      cnpj: ['', Validators.required],
      telefonesApiOficial: this.fb.array([this.criarControleTelefone()]),
      bmAdministradaPorMarketing: ['', Validators.required],
      empresaMarketingNome: [''],
      empresaMarketingTelefone: [''],
      autorizacaoAcessoBm: [false],
      aceiteTermosCoexistencia: [false, Validators.requiredTrue],
      observacoes: [''],
    });

    this.formulario
      .get('bmAdministradaPorMarketing')
      ?.valueChanges.subscribe((valor) => this.atualizarValidacoesMarketing(valor));
  }

  get f() {
    return this.formulario.controls;
  }

  get telefonesApiOficial(): FormArray {
    return this.formulario.get('telefonesApiOficial') as FormArray;
  }

  get controlesTelefone(): AbstractControl[] {
    return this.telefonesApiOficial.controls;
  }

  adicionarTelefone(): void {
    this.telefonesApiOficial.push(this.criarControleTelefone());
  }

  removerTelefone(index: number): void {
    if (this.telefonesApiOficial.length <= 1) {
      return;
    }
    this.telefonesApiOficial.removeAt(index);
  }

  liberarAceiteTermosAoExpandir(estaAberto: boolean): void {
    if (estaAberto) {
      this.termosCoexistenciaLiberado = true;
    }
  }

  enviar(): void {
    this.submitSuccess = false;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.telefonesApiOficial.controls.forEach((controle) => controle.markAsTouched());
      return;
    }

    const dados = this.formulario.getRawValue();
    const telefonesApiOficial = this.normalizarLista(this.telefonesApiOficial.value);
    const possuiMarketing = dados.bmAdministradaPorMarketing === 'sim';

    this.dadosEnviados = {
      cnpj: dados.cnpj,
      telefonesApiOficial,
      empresaMarketing:
        possuiMarketing
          ? {
              nome: dados.empresaMarketingNome,
              telefone: dados.empresaMarketingTelefone,
            }
          : null,
      clienteCienteAutorizacaoAcessoBmZapfarma: dados.autorizacaoAcessoBm,
      aceiteTermosCoexistencia: dados.aceiteTermosCoexistencia,
      observacoes: dados.observacoes,
    };

    const mensagem = [
      'Olá, segue abaixo o formulário de COEX + API Oficial.',
      '',
      'Dados da empresa',
      `- CNPJ: ${dados.cnpj}`,
      'Telefones para API Oficial',
      ...telefonesApiOficial.map((telefone: string) => `- ${telefone}`),
      '',
      'BM administrada por empresa de marketing?',
      `- ${possuiMarketing ? 'Sim' : 'Não'}`,
      ...(possuiMarketing
        ? [
            'Dados da empresa de marketing',
            `- Nome: ${dados.empresaMarketingNome}`,
            `- Telefone: ${dados.empresaMarketingTelefone}`,
          ]
        : []),
      '',
      'Ciência sobre autorização BM',
      `- Cliente ciente: ${dados.autorizacaoAcessoBm ? 'Sim' : 'Não'}`,
      '',
      'Termo de uso e boas práticas (Coexistência)',
      `- Li e aceito os termos: ${dados.aceiteTermosCoexistencia ? 'Sim' : 'Não'}`,
      ...(dados.observacoes ? ['', 'Observações', `- ${dados.observacoes}`] : []),
    ].join('\n');

    this.submitting = true;
    const whatsappLink = `https://wa.me/${this.whatsappSuporte}?text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(whatsappLink, '_blank');
    this.submitting = false;
    this.submitSuccess = true;
  }

  novaColeta(): void {
    while (this.telefonesApiOficial.length > 1) {
      this.telefonesApiOficial.removeAt(this.telefonesApiOficial.length - 1);
    }
    this.telefonesApiOficial.at(0).reset('');

    this.formulario.reset({
      cnpj: '',
      bmAdministradaPorMarketing: '',
      empresaMarketingNome: '',
      empresaMarketingTelefone: '',
      autorizacaoAcessoBm: false,
      aceiteTermosCoexistencia: false,
      observacoes: '',
    });

    this.atualizarValidacoesMarketing('');
    this.termosCoexistenciaLiberado = false;
    this.submitSuccess = false;
    this.dadosEnviados = null;
  }

  private criarControleTelefone(): FormControl {
    return this.fb.control('', Validators.required) as FormControl;
  }

  private normalizarLista(valores: string[] | null | undefined): string[] {
    if (!Array.isArray(valores)) {
      return [];
    }

    return valores.map((valor) => `${valor ?? ''}`.trim()).filter((valor) => valor.length > 0);
  }

  private atualizarValidacoesMarketing(valor: string): void {
    const nome = this.formulario.get('empresaMarketingNome');
    const telefone = this.formulario.get('empresaMarketingTelefone');

    if (!nome || !telefone) {
      return;
    }

    if (valor === 'sim') {
      nome.setValidators([Validators.required]);
      telefone.setValidators([Validators.required]);
    } else {
      nome.clearValidators();
      telefone.clearValidators();
      nome.setValue('');
      telefone.setValue('');
    }

    nome.updateValueAndValidity({ emitEvent: false });
    telefone.updateValueAndValidity({ emitEvent: false });
  }
}
