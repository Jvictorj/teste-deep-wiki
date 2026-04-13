import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'front-zapfarma-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    frontZapFarmaHeaderComponent,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatIcon
  ],
  providers: [UsuariosService],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  @ViewChild('btnLogar', { read: ElementRef })
  btnLogar!: ElementRef<HTMLElement>;

  formLogin: FormGroup;
  loginError = false;
  hide = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _usuariosService: UsuariosService
  ) {
    this.criarForm();
  }

  criarForm() {
    this.formLogin = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      senha: ['', [Validators.required]],
    });
  }

  logar() {
    if (this.formLogin.invalid) {
      return;
    }
    const usuario = this.formLogin.getRawValue() as any;
    this._usuariosService.logar(usuario).subscribe((response) => {
      if (!response.cpfCnpj) {
        this.loginError = true;
      }
      else {
        this.dashboard();
      }
    });
  }

  recuperarSenha() {
    this.router.navigate(['/esqueceu-senha']);
  }

  exibirSenha() {
    this.hide = !this.hide;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.btnLogar?.nativeElement?.focus();
      this.logar();
    }
  }

  esqueceuSenha() {
    this.router.navigate(['/esqueceu-senha']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  novoUsuario() {
    this.router.navigate(['/novo-usuario']);
  }

  dashboard() {
    if (this._usuariosService.podeGerenciarTudoLogado) {
      this.router.navigate(['/dashboard']);
      return;
    }
    if (this._usuariosService.podeAcessarTelaUsuariosLogado) {
      this.router.navigate(['/usuarios-afiliados']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
