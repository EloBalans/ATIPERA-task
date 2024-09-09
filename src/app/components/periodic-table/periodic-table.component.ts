import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { IPeriodicElement } from '../../models/periodic-element.model';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InputComponent } from '../input/input.component';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { debounceTime } from 'rxjs';
import { FILTER_DEBOUNCE } from '../../consts/filter-debounce.const';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatTable,
    MatProgressSpinner,
    InputComponent,
    MatCard,
    MatCardContent,
    MatIconButton,
    MatIcon,
    MatError,
  ],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
})
export class PeriodicTableComponent implements OnInit {
  periodicElements = input.required<IPeriodicElement[]>();
  loading = input<boolean>(false);
  error = input<string | null>(null);
  displayedColumns = input.required<string[]>();

  clickRowEvent = output<IPeriodicElement>();
  refreshEvent = output<void>();

  filterControl = new FormControl<string>(``);
  destroyRef = inject(DestroyRef);

  dataSource = computed(() => {
    return new MatTableDataSource(this.periodicElements());
  });

  ngOnInit() {
    this.initFiltersChange();
  }

  initFiltersChange() {
    this.filterControl.valueChanges
      .pipe(debounceTime(FILTER_DEBOUNCE), takeUntilDestroyed(this.destroyRef))
      .subscribe((filterValue: string | null) => {
        this.dataSource().filter = filterValue
          ? filterValue.trim().toLowerCase()
          : '';
      });
  }

  onRowClick(periodicElement: IPeriodicElement) {
    this.clickRowEvent.emit(periodicElement);
  }

  refresh() {
    this.refreshEvent.emit();
  }
}
