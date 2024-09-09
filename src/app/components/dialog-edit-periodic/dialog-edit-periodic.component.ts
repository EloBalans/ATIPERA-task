import {
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IPeriodicElement } from '../../models/periodic-element.model';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { PeriodicService } from '../../services/periodic.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-dialog-edit-periodic',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatButton,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatProgressSpinner,
    InputComponent,
  ],
  templateUrl: './dialog-edit-periodic.component.html',
  styleUrl: './dialog-edit-periodic.component.scss',
})
export class DialogEditPeriodicComponent implements OnInit {
  formBuilder = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef<DialogEditPeriodicComponent>);
  periodicService = inject(PeriodicService);
  destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  form = this.formBuilder.group<IPeriodicElementForm>({
    position: this.formBuilder.control<number | null>(null, [
      Validators.required,
    ]),
    name: this.formBuilder.control<string | null>(null, [Validators.required]),
    weight: this.formBuilder.control<number | null>(null, [
      Validators.required,
    ]),
    symbol: this.formBuilder.control<string | null>(null, [
      Validators.required,
    ]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: IPeriodicElement) {}

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        position: this.data.position,
        name: this.data.name,
        weight: this.data.weight,
        symbol: this.data.symbol,
      });
      console.log(typeof this.form.value.position);
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const sanitizedValue: IPeriodicElement = {
        position: formValue.position ?? this.data.position,
        name: formValue.name ?? this.data.name,
        weight: formValue.weight ?? this.data.weight,
        symbol: formValue.symbol ?? this.data.symbol,
      };

      this.loading.set(true);
      this.periodicService
        .edit(sanitizedValue)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading.set(false)),
        )
        .subscribe({
          next: (periodicElements: IPeriodicElement): void => {
            this.dialogRef.close(periodicElements);
            this.error.set(null);
          },
          error: (e: string): void => {
            this.error.set(e);
          },
        });
    } else {
      this.error.set('Form is invalid!');
    }
  }
}

export interface IPeriodicElementForm {
  position: FormControl<number | null>;
  name: FormControl<string | null>;
  weight: FormControl<number | null>;
  symbol: FormControl<string | null>;
}
