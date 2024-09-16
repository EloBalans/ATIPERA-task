import { computed, Directive, inject } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PeriodicElementState } from '../models/periodic-element-state.model';
import { PeriodicService } from '../services/periodic.service';
import { rxActions } from '@rx-angular/state/actions';
import { IPeriodicElement } from '../models/periodic-element.model';
import { DEFAULT_PERIODIC_ELEMENT_STATE } from '../consts/periodic-element-state.const';
import {
  catchError,
  debounceTime,
  endWith,
  exhaustMap,
  map,
  of,
  startWith,
  tap,
} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { FILTER_DEBOUNCE } from '../consts/filter-debounce.const';

@Directive({
  standalone: true,
})
export class PeriodicTableState extends RxState<PeriodicElementState> {
  periodicService = inject(PeriodicService);

  filterControl = new FormControl<string>('');

  actions = rxActions<{
    update: { old: IPeriodicElement; updated: IPeriodicElement };
    refresh: void;
  }>();
  dataSource = computed(
    () => new MatTableDataSource(this.filteredPeriodicElements()),
  );

  loading = this.signal('loading');
  error = this.signal('error');
  displayedColumns = this.signal('displayedColumns');

  constructor() {
    super();
    this.set(DEFAULT_PERIODIC_ELEMENT_STATE);

    this.connect(
      this.periodicService.getAll().pipe(
        map((periodicElements) => ({ periodicElements })),
        catchError((error) => of({ error: error })),
        startWith({ loading: true }),
        endWith({ loading: false }),
      ),
    );

    this.connect(
      this.filterControl.valueChanges.pipe(
        tap(() => this.set({ loading: true })), // Ustawienie loading na true przed filtrowaniem
        debounceTime(FILTER_DEBOUNCE),
        map((searchValue) => ({ searchValue })),
        tap(() => this.set({ loading: false })), // Ustawienie loading na false po zakończeniu filtrowania
      ),
    );
  }

  filteredPeriodicElements = this.computed(
    ({ periodicElements, searchValue }) => {
      const searchTerm = searchValue()?.toLowerCase();
      if (!searchTerm) {
        return periodicElements();
      }

      return periodicElements().filter((periodicElement) => {
        return Object.values(periodicElement).some((value) =>
          value.toString().toLowerCase().includes(searchTerm),
        );
      });
    },
  );

  private readonly refreshEffect = this.actions.onRefresh((refresh$) =>
    refresh$.pipe(
      tap(() => this.set({ loading: true })),
      exhaustMap(() =>
        this.periodicService.getAll().pipe(
          map((periodicElements) => ({ periodicElements })),
          catchError((error) => of({ error: error })),
          tap(() => this.set({ loading: false })),
        ),
      ),
    ),
  );

  private readonly updateEffect = this.actions.onUpdate((update$) =>
    update$.pipe(
      tap(() => this.set({ loading: true })),
      exhaustMap(({ old, updated }) =>
        this.periodicService.edit(updated).pipe(
          map(() => {
            const currentElements = this.get().periodicElements;
            const updatedElements = currentElements.map(
              (element: IPeriodicElement) =>
                element.position === old.position
                  ? { ...element, ...updated }
                  : element,
            );
            this.set({ periodicElements: updatedElements });
          }),
          catchError((error) => of({ error: error.message })),
          tap(() => this.set({ loading: false })),
        ),
      ),
    ),
  );
}
