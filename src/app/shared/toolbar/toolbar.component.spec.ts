/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  const usuariosServiceStub = {
    get logado() {
      return false;
    },
    get obterUsuarioLogado() {
      return null;
    },
    deslogar: jasmine.createSpy('deslogar'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [{ provide: UsuariosService, useValue: usuariosServiceStub }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
