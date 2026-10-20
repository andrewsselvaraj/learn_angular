import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval, map } from 'rxjs';

/**
 * Lesson 4: the async pipe
 *
 * Instead of calling .subscribe() yourself, give the Observable to the template
 * with "| async". Angular subscribes for you, shows the latest value,
 * and unsubscribes automatically when the component is destroyed.
 * This is the easiest way to avoid memory leaks.
 */
@Component({
  selector: 'app-async-pipe-demo',
  imports: [AsyncPipe],
  template: `
    <section>
      <h2>4. The async pipe</h2>
      <p>
        Seconds on this page: <strong>{{ seconds$ | async }}</strong>
      </p>
      <p>
        Clock: <strong>{{ clock$ | async }}</strong>
      </p>
    </section>
  `,
})
export class AsyncPipeDemo {
  // interval(1000) emits 0, 1, 2, ... every second, forever.
  seconds$ = interval(1000);

  // The same idea, mapped into a formatted time string.
  clock$ = interval(1000).pipe(map(() => new Date().toLocaleTimeString()));
}
