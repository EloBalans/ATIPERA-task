import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PeriodicService } from './services/periodic.service';
import { IPeriodicElement } from './models/periodic-element.model';
import { finalize, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditPeriodicComponent } from './components/dialog-edit-periodic/dialog-edit-periodic.component';
import { PeriodicTableComponent } from './components/periodic-table/periodic-table.component';
import { MatCardModule } from '@angular/material/card';
import { InputComponent } from './components/input/input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PeriodicTableComponent,
    MatCardModule,
    InputComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  periodicService = inject(PeriodicService);
  dialog = inject(MatDialog);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  periodicElements = signal<IPeriodicElement[]>([]);
  displayedColumns = signal<string[]>(['position', 'name', 'weight', 'symbol']);

  ngOnInit() {
    this.loadTableData();
  }

  loadTableData() {
    this.loading.set(true);
    this.periodicService
      .getAll()
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (periodicElements: IPeriodicElement[]): void => {
          this.periodicElements.set(periodicElements);
          this.error.set(null);
        },
        error: (e: string): void => {
          this.error.set(e);
        },
      });
  }

  editRow(periodicElement: IPeriodicElement) {
    const dialogRef = this.dialog.open(DialogEditPeriodicComponent, {
      data: periodicElement,
    });

    dialogRef.afterClosed().subscribe((el: IPeriodicElement | undefined) => {
      if (el) {
        this.periodicElements.update((elements: IPeriodicElement[]) =>
          elements.map((element: IPeriodicElement) =>
            element.position === periodicElement.position
              ? { ...element, ...el }
              : element,
          ),
        );
      }
    });
  }
}
