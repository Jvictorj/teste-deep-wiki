import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'front-zapfarma-criacao-drogaria',
  standalone: true,
  templateUrl: './criacao-drogaria.component.html',
  styleUrls: ['./criacao-drogaria.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarComponent,
    RodapeComponent,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class CriacaoDrogariaComponent {
  formulario: FormGroup;
  submitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      drogaria: ['', Validators.required],
      telefones: this.fb.array([this.criarTelefoneControl()]),
      atendentes: this.fb.array([this.criarAtendenteControl()]),
      gerenciais: this.fb.array([this.criarGerencialControl()]),
      emailCliente: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.formulario.controls;
  }

  get telefones(): FormArray {
    return this.formulario.get('telefones') as FormArray;
  }

  get atendentes(): FormArray {
    return this.formulario.get('atendentes') as FormArray;
  }

  get gerenciais(): FormArray {
    return this.formulario.get('gerenciais') as FormArray;
  }

  adicionarTelefone(): void {
    this.telefones.push(this.criarTelefoneControl());
  }

  removerTelefone(index: number): void {
    if (this.telefones.length > 1) {
      this.telefones.removeAt(index);
    }
  }

  adicionarAtendente(): void {
    this.atendentes.push(this.criarAtendenteControl());
  }

  removerAtendente(index: number): void {
    if (this.atendentes.length > 1) {
      this.atendentes.removeAt(index);
    }
  }

  adicionarGerencial(): void {
    this.gerenciais.push(this.criarGerencialControl());
  }

  removerGerencial(index: number): void {
    if (this.gerenciais.length > 1) {
      this.gerenciais.removeAt(index);
    }
  }

  enviarFormulario(): void {
    this.submitSuccess = false;
    this.submitError = null;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.getRawValue();
    const telefones = this.normalizarLista(this.telefones.value);
    const atendentes = this.normalizarLista(this.atendentes.value);
    const gerenciais = this.normalizarLista(this.gerenciais.value);
    const mensagem = [
      'Olá, segue abaixo o formulário de criação de drogaria para cadastro no sistema ZapFarma.',
      '',
      'Dados da drogaria',
      `- Nome: ${dados.drogaria}`,
      `- E-mail do cliente: ${dados.emailCliente}`,
      'Telefones a serem cadastrados',
      ...telefones.map((telefone) => `- ${telefone}`),
      '',
      'Equipe de atendimento',
      `- Quantidade de atendentes: ${atendentes.length}`,
      'Atendentes',
      ...atendentes.map((nome) => `- ${nome}`),
      '',
      'Equipe gerencial',
      `- Quantidade de usuários gerenciais: ${gerenciais.length}`,
      'Usuários gerenciais',
      ...gerenciais.map((nome) => `- ${nome}`),
    ].join('\n');

    this.submitting = true;

    const whatsappLink = `https://wa.me/552135205492?text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(whatsappLink, '_blank');
    this.submitting = false;
    this.submitSuccess = true;

    /*
    this.submitting = true;

    const payload = {
      nome: dados.drogaria,
      email: dados.emailCliente,
      telefone: dados.telefone,
      assunto: 'Formulário de criação de drogaria',
      mensagem,
    };

    this.contatoService.enviarContato(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = true;
        this.formulario.reset();
      },
      error: () => {
        this.submitting = false;
        this.submitError =
          'Não foi possível enviar as informações. Tente novamente em instantes.';
      },
    });
    */
  }

  private criarTelefoneControl() {
    return this.fb.control('', Validators.required);
  }

  private criarAtendenteControl() {
    return this.fb.control('', Validators.required);
  }

  private criarGerencialControl() {
    return this.fb.control('', Validators.required);
  }

  private normalizarLista(valores: string[] | null | undefined): string[] {
    if (!Array.isArray(valores)) {
      return [];
    }

    return valores.map((valor) => valor.trim()).filter((valor) => valor.length > 0);
  }
}
