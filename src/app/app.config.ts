import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '../amplify.config';

Amplify.configure(amplifyConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay())
  ]
};
