import { FormControl } from '@angular/forms';

export interface IPeriodicElementForm {
  position: FormControl<number | null>;
  name: FormControl<string | null>;
  weight: FormControl<number | null>;
  symbol: FormControl<string | null>;
}
