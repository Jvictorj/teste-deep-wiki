import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { catchError, of } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'front-zapfarma-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss'],
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
    
  ],
  providers: [provideNgxMask(), UsuariosService],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlterarSenhaComponent {
  formLogin!: FormGroup;
  validCpf = true;
  onSubmitValidate = false;
  btnDisable = false;
  sucesso = false;
  error = '';
  _id: string | null = null;

  constructor(
    private router: Router,
    private _UsuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private routerActivate: ActivatedRoute, 

  ) {

    this.routerActivate.queryParamMap.subscribe((params) => {
      const idFromQuery =
        params.get('id') ||
        params.get('token') ||
        params.get('codigo') ||
        params.get('userId');

      const idFromPath =
        this.routerActivate.snapshot.paramMap.get('id') ||
        this.routerActivate.snapshot.paramMap.get('token');

      this._id = idFromQuery || idFromPath;

      if (!this._id) {
        this.error = 'Link inválido ou expirado. Solicite uma nova recuperação de senha.';
      }
    });
    this.criarForm();
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }

  alterarSenha() {
    if (!this._id) {
      this.sucesso = false;
      this.error = 'Link inválido ou expirado. Solicite uma nova recuperação de senha.';
      return;
    }

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const senha = this.formLogin.controls['senha'].value;
    this._UsuariosService
      .AlterarSenhaUsuarios(this._id, senha)
      .pipe(
        catchError((ret) => {
          this.sucesso = false;
          this.error = ret?.error?.msg || 'Não foi possível alterar a senha. Tente novamente.';
          return of(false);
        })
      )
      .subscribe((ret) => {
        if (!ret) {
          return;
        }
        this.sucesso = true;
        this.error = '';
      });
  }

  openDialogCPF() {
    throw new Error('Method not implemented.');
  }

  criarForm() {
      this.formLogin = this.formBuilder.group({
        senha: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(200),
        ]),
      
    })
  }
}
