import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Lesson 5: HttpClient
 *
 * Every HttpClient call returns an Observable. The request is only sent
 * when something subscribes (here, the async pipe). It emits one value
 * (the response) and then completes.
 *
 * The search box shows the classic "type-ahead" pattern that makes RxJS shine:
 * Subject of keystrokes -> debounceTime -> distinctUntilChanged -> switchMap(http).
 */
@Component({
  selector: 'app-http-demo',
  imports: [AsyncPipe],
  template: `
    <section>
      <h2>5. HttpClient</h2>
      <input placeholder="Search users by name, e.g. le" (input)="search($event)" />
      @if (error()) {
        <p>{{ error() }}</p>
      }
      @if (users$ | async; as users) {
        <ul>
          @for (user of users; track user.id) {
            <li>{{ user.name }} ({{ user.email }})</li>
          } @empty {
            <li>No users match.</li>
          }
        </ul>
      } @else {
        <p>Loading...</p>
      }
    </section>
  `,
})
export class HttpDemo {
  private http = inject(HttpClient);
  private url = 'https://jsonplaceholder.typicode.com/users';

  // Stream of search terms typed by the user.
  private terms = new Subject<string>();
  error = signal('');

  users$: Observable<User[]> = this.terms.pipe(
    startWith(''), // load everyone once at start
    debounceTime(300), // wait until typing pauses for 300ms
    distinctUntilChanged(), // skip if the term did not actually change
    // switchMap cancels the previous request when a new term arrives,
    // so a slow old response can never overwrite a newer one.
    switchMap((term) => {
      this.error.set('');
      return this.http.get<User[]>(this.url).pipe(
        map((users) => users.filter((u) => u.name.toLowerCase().includes(term.toLowerCase()))),
        // On a network error, show a message and an empty list instead of breaking the stream.
        catchError(() => {
          this.error.set('Could not reach the users API. Check your internet connection.');
          return of([] as User[]);
        }),
      );
    }),
  );

  search(event: Event) {
    this.terms.next((event.target as HTMLInputElement).value);
  }
}
