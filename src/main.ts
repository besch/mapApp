import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { GOOGLE_MAPS_PROVIDERS } from 'angular2-google-maps/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms'; 
import { AppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  GOOGLE_MAPS_PROVIDERS
]);
