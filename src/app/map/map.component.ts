import { Component, provide, OnInit } from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  MouseEvent,
  GOOGLE_MAPS_PROVIDERS,
  GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';

import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

@Component({
  moduleId: module.id,
  selector: 'app-map',
  directives: [GOOGLE_MAPS_DIRECTIVES, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES],
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.less']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
