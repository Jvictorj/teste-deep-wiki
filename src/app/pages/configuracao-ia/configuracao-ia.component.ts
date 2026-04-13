import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { IaConfiguracaoService } from '../../services/ia-configuracao/ia-configuracao.service';
import { ToolbarComponent } from '../../shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'front-zapfarma-configuracao-ia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarComponent,
    RodapeComponent,
    NgxMaskDirective,
  ],
  templateUrl: './configuracao-ia.component.html',
  styleUrls: ['./configuracao-ia.component.scss'],
  providers: [provideNgxMask()],
})
export class ConfiguracaoIaComponent {
  iaConfigForm: FormGroup;
  submitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  infoHints: Record<string, boolean> = {};

  constructor(
    private fb: FormBuilder,
    private iaConfiguracaoService: IaConfiguracaoService
  ) {
    this.iaConfigForm = this.fb.group({
      empresa: ['', Validators.required],
      nomeIa: ['', Validators.required],
      cnpj: ['', Validators.required],
      responsavel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      segmento: ['', Validators.required],
      numeroFiliais: ['', Validators.required],
      volumeAtendimentos: ['', Validators.required],
      canaisAtendimento: ['', Validators.required],
      sistemasIntegrados: ['', Validators.required],
      objetivosIa: ['', Validators.required],
      tomDeVoz: ['', Validators.required],
      palavrasChave: ['', Validators.required],
      baseConhecimento: ['', Validators.required],
      horariosAtendimento: ['', Validators.required],
      horarioAtendimento: ['', Validators.required],
      taxaEntrega: ['', Validators.required],
      valorIsencaoTaxa: ['', Validators.required],
      trabalhaGenericos: ['', Validators.required],
      programaPrecoPopular: ['', Validators.required],
      numeroDelivery: ['', Validators.required],
      formasPagamento: ['', Validators.required],
      modeloPedido: ['', Validators.required],
      servicosDrogaria: ['', Validators.required],
      gatilhosTransferenciaHumano: ['', Validators.required],
      restricoes: [''],
      observacoes: [''],
      consentimentoLgpd: [false, Validators.requiredTrue],
    });
  }

  get f() {
    return this.iaConfigForm.controls;
  }

  toggleHint(field: string): void {
    this.infoHints[field] = !this.infoHints[field];
  }

  enviarConfiguracao(): void {
    this.submitSuccess = false;
    this.submitError = null;

    if (this.iaConfigForm.invalid) {
      this.iaConfigForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.iaConfiguracaoService
      .salvarConfiguracao(this.iaConfigForm.value)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.submitSuccess = true;
          this.iaConfigForm.reset({
            consentimentoLgpd: false,
          });
        },
        error: () => {
          this.submitting = false;
          this.submitError =
            'Não foi possível salvar as informações. Tente novamente em instantes.';
        },
      });
  }
}
