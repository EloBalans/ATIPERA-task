import { IPeriodicElement } from './periodic-element.model';

export interface PeriodicElementState {
  periodicElements: IPeriodicElement[];
  displayedColumns: string[];
  loading: boolean;
  error: string;
  searchValue: string | null;
}
