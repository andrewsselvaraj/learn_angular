import { Component, OnDestroy, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Lesson 1: Observable + subscribe
 *
 * An Observable is a stream of values that arrive over time.
 * Nothing happens until someone calls .subscribe() on it.
 * A subscription keeps running until it completes, errors, or you unsubscribe.
 */
@Component({
  selector: 'app-observable-basics',
  template: `
    <section>
      <h2>1. Observable and subscribe</h2>
      <button (click)="start()">Subscribe</button>
      <button (click)="stop()">Unsubscribe</button>
      <div class="log">{{ log().join('\\n') }}</div>
    </section>
  `,
})
export class ObservableBasics implements OnDestroy {
  // The view reads this signal, so pushing to it updates the page.
  log = signal<string[]>([]);

  // Build an Observable by hand: it emits "tick 1", "tick 2", ... once a second,
  // then completes after 5 ticks.
  private ticks$ = new Observable<string>((subscriber) => {
    let count = 0;
    const id = setInterval(() => {
      count++;
      subscriber.next(`tick ${count}`); // send a value
      if (count === 5) subscriber.complete(); // say "no more values"
    }, 1000);

    // This teardown function runs on complete, error, or unsubscribe.
    return () => clearInterval(id);
  });

  private subscription?: Subscription;

  start() {
    this.stop();
    this.log.set(['subscribed']);
    this.subscription = this.ticks$.subscribe({
      next: (value) => this.add(value),
      error: (err) => this.add(`error: ${err}`),
      complete: () => this.add('complete'),
    });
  }

  stop() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
      this.add('unsubscribed');
    }
  }

  // Always clean up manual subscriptions, or they keep running after the component is gone.
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private add(line: string) {
    this.log.update((lines) => [...lines, line]);
  }
}
