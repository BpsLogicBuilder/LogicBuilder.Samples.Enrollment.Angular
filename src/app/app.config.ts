import { ApplicationConfig, inject, importProvidersFrom, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EnvironmentConfigService } from './common/environment-config.service';
// @ts-ignore - Temporary bridge for Kendo UI v22 compatibility
import { provideAnimations /*NOSONAR - required by Kendo UI*/ } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMarkdown, MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { marked } from 'marked';

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  //const originalLinkRenderer = renderer.link;

  // Intercept the default link rendering function
  renderer.link = (token) => {
    // 1. Resolve text content. If it has child tokens, parse them using the current execution context.
    // 'this.parser' is fully populated when marked executes this function at runtime.
    const textContent = token.tokens
      ? (marked.parseInline(token.text, { gfm: true }) as string)
      : token.text;

    // 2. Safely read metadata fields
    const hrefAttr = token.href ? `href="${token.href}"` : '';
    const titleAttr = token.title ? `title="${token.title}"` : '';

    // 3. Directly return the target="_blank" anchor string
    return `<a ${hrefAttr} ${titleAttr} target="_blank" rel="noopener noreferrer">${textContent}</a>`;
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    // @ts-ignore - Temporary bridge for Kendo UI v22 compatibility
    provideAnimations(),//NOSONAR - required by Kendo UI
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => {
        const runtimeConfig: EnvironmentConfigService = inject(EnvironmentConfigService);
        return runtimeConfig.load();
    }),
    provideRouter(routes),
    importProvidersFrom(NgbModule),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
      },
    })
  ]
};
