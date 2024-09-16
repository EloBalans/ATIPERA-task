import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IPeriodicElement } from '../../models/periodic-element.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InputComponent } from '../input/input.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { JsonPipe } from '@angular/common';
import { DialogEditPeriodicComponent } from '../dialog-edit-periodic/dialog-edit-periodic.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { PeriodicTableState } from '../../state/periodic-table.state';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    MatError,
    MatTableModule,
    InputComponent,
    MatIcon,
    MatProgressSpinner,
    MatIconButton,
    JsonPipe,
    MatSort,
  ],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicTableComponent extends PeriodicTableState {
  dialog = inject(MatDialog);

  constructor() {
    super();
  }

  refresh() {
    this.actions.refresh();
  }

  onRowClick(oldPeriodicElement: IPeriodicElement) {
    const dialogRef = this.dialog.open(DialogEditPeriodicComponent, {
      data: oldPeriodicElement,
    });

    dialogRef
      .afterClosed()
      .subscribe((newPeriodicElement: IPeriodicElement | undefined) => {
        if (newPeriodicElement) {
          this.actions.update({
            updated: newPeriodicElement,
            old: oldPeriodicElement,
          });
        }
      });
  }
}
