import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { PeriodicTableComponent } from '../periodic-table/periodic-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-card-periodic-elements',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    PeriodicTableComponent,
    AsyncPipe,
  ],
  templateUrl: './card-periodic-elements.component.html',
  styleUrl: './card-periodic-elements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPeriodicElementsComponent {}
