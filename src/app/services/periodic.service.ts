import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { IPeriodicElement } from '../models/periodic-element.model';
import { ELEMENT_DATA } from '../consts/periodic-element.const';
import { DEFAULT_TIMEOUT } from '../consts/timeout.const';
import { ERROR_CHANCE } from '../consts/error-chance.const';

@Injectable({
  providedIn: 'root',
})
export class PeriodicService {
  getAll(): Observable<IPeriodicElement[]> {
    return of(ELEMENT_DATA).pipe(
      delay(DEFAULT_TIMEOUT),
      map(() => {
        if (Math.random() < ERROR_CHANCE) {
          throw new Error('Random error occurred!');
        }

        return ELEMENT_DATA;
      }),
      catchError((error) => {
        return throwError(() => error.message || 'Unknown error');
      }),
    );
  }

  edit(periodicElement: IPeriodicElement): Observable<IPeriodicElement> {
    return of(periodicElement).pipe(
      delay(DEFAULT_TIMEOUT),
      map(() => {
        if (Math.random() < ERROR_CHANCE) {
          throw new Error('Random error occurred!');
        }

        return periodicElement;
      }),
      catchError((error) => {
        return throwError(() => error.message || 'Unknown error');
      }),
    );
  }
}
