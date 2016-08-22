import { Component, OnInit } from '@angular/core';
import { InfoWindowComponent } from '../info-window/';

@Component({
  moduleId: module.id,
  selector: 'app-marker',
  templateUrl: 'marker.component.html',
  styleUrls: ['marker.component.css'],
  directives: [InfoWindowComponent]
})
export class MarkerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
