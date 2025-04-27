// src/app/app.config.ts
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports';

if (typeof window !== 'undefined') {
  // Create a shallow clone so we don't mutate aws-exports.js directly
  const config = {...awsmobile };

  // Drop only the empty oauth block
  //delete config.oauth;

  // Now wire up your full Amplify config (Auth + API, etc.)
  Amplify.configure(config);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
