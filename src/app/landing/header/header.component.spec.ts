import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ThemeService } from '../../theme/theme.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let documentRef: Document;
  let currentTheme: 'light' | 'dark';
  let themeService: { getTheme: jest.Mock; toggleTheme: jest.Mock };
  let imageConstructorSpy: jest.Mock;

  beforeEach(async () => {
    currentTheme = 'light';
    imageConstructorSpy = jest.fn(() => ({ decoding: 'auto', src: '' }));
    Object.defineProperty(window, 'Image', {
      configurable: true,
      writable: true,
      value: imageConstructorSpy,
    });
    themeService = {
      getTheme: jest.fn(() => currentTheme),
      toggleTheme: jest.fn(() => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', currentTheme === 'dark');
      }),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    documentRef = TestBed.inject(DOCUMENT);
    documentRef.documentElement.classList.remove('dark');
    fixture.detectChanges();
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('should open and close the mobile menu from the overlay', () => {
    const menuButton = fixture.debugElement.query(
      By.css('button[aria-label="Abrir menu principal"]'),
    );

    menuButton.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.isMenuOpen).toBe(true);
    expect(menuButton.nativeElement.getAttribute('aria-expanded')).toBe('true');

    const overlay = fixture.debugElement.query(By.css('.sheet-overlay'));
    overlay.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.isMenuOpen).toBe(false);
    expect(fixture.nativeElement.querySelector('.sheet-overlay')).toBeNull();
  });

  it('should close the mobile menu when escape is pressed', () => {
    component.openMenu();
    fixture.detectChanges();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(component.isMenuOpen).toBe(false);
  });

  it('should close the mobile menu when a navigation link is clicked', () => {
    component.openMenu();
    fixture.detectChanges();

    const mobileLink = fixture.debugElement.query(By.css('.mobile-menu__link'));
    mobileLink.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.isMenuOpen).toBe(false);
  });

  it('should toggle the theme through ThemeService and sync the icon state', () => {
    const themeButtons = fixture.debugElement.queryAll(
      By.css('button[aria-label="Alternar modo escuro"]'),
    );

    themeButtons[0].triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(themeService.toggleTheme).toHaveBeenCalledTimes(1);
    expect(component.isDark).toBe(true);
    expect(documentRef.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should preload the seal assets and switch to the white seal in dark mode', () => {
    const sealImage = fixture.debugElement.query(By.css('.partner-seal img'));

    expect(imageConstructorSpy).toHaveBeenCalledTimes(2);
    expect(sealImage.nativeElement.getAttribute('src')).toBe(component.lightSealSrc);

    component.toggleDarkMode();
    fixture.detectChanges();

    expect(sealImage.nativeElement.getAttribute('src')).toBe(component.darkSealSrc);
  });
});
