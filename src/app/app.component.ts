import {ChangeDetectionStrategy, Component} from '@angular/core';

import { CardPeriodicElementsComponent } from './components/card-periodic-elements/card-periodic-elements.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardPeriodicElementsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
