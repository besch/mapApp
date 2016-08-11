import { Component } from '@angular/core';
import { MapComponent } from './map/index';
// import { MapComponent } from './map/map.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
