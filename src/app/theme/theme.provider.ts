import { APP_INITIALIZER, Provider } from '@angular/core';
import { ThemeService, ThemeMode } from './theme.service';

export function provideTheme(defaultTheme: ThemeMode = 'light'): Provider[] {
  return [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (theme: ThemeService) => () => theme.init(defaultTheme),
      deps: [ThemeService],
    },
  ];
}
