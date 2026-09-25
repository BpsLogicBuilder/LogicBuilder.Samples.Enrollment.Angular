import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EnvironmentConfigService } from './common/environment-config.service';
// @ts-ignore - Temporary bridge for Kendo UI v22 compatibility
import { provideAnimations /*NOSONAR - required by Kendo UI*/ } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // @ts-ignore - Temporary bridge for Kendo UI v22 compatibility
    provideAnimations(),//NOSONAR - required by Kendo UI
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => {
        const runtimeConfig: EnvironmentConfigService = inject(EnvironmentConfigService);
        return runtimeConfig.load();
    }),
    provideRouter(routes)
  ]
};
