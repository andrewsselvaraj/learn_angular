import { Component, signal } from '@angular/core';
import { filter, from, map } from 'rxjs';

/**
 * Lesson 2: operators (map, filter)
 *
 * Operators are functions you put inside .pipe(...).
 * Each one takes the stream coming in and returns a new stream going out,
 * just like Array.map / Array.filter, but for values that arrive over time.
 */
@Component({
  selector: 'app-operators',
  template: `
    <section>
      <h2>2. Operators: filter and map</h2>
      <p>
        Source: <code>{{ source.join(', ') }}</code>
      </p>
      <p><code>filter(n =&gt; n % 2 === 0)</code> then <code>map(n =&gt; n * 10)</code></p>
      <button (click)="run()">Run</button>
      <div class="log">{{ result().join(', ') }}</div>
    </section>
  `,
})
export class Operators {
  source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  result = signal<number[]>([]);

  run() {
    this.result.set([]);
    from(this.source) // turns the array into a stream: 1, 2, 3, ...
      .pipe(
        filter((n) => n % 2 === 0), // keep only even numbers: 2, 4, 6, 8, 10
        map((n) => n * 10), // transform each one: 20, 40, 60, 80, 100
      )
      // from() completes on its own, so this subscription cleans itself up.
      .subscribe((n) => this.result.update((list) => [...list, n]));
  }
}
