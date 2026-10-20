import { Component, Injectable, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Subject, scan } from 'rxjs';

/**
 * Lesson 3: Subject and BehaviorSubject
 *
 * A Subject is an Observable you can push values into yourself with .next().
 * It is the usual way to share events or state between components through a service.
 *
 * - Subject: late subscribers only see values sent after they subscribed.
 * - BehaviorSubject: holds a current value; new subscribers get it right away.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  // Keep the Subject private so only the service can call .next()...
  private readonly count = new BehaviorSubject<number>(0);
  // ...and expose it read-only with asObservable().
  readonly count$ = this.count.asObservable();

  private readonly events = new Subject<string>();
  // scan is like Array.reduce over time: it collects every event into a list.
  readonly history$ = this.events.pipe(scan((all, e) => [...all, e], [] as string[]));

  add() {
    this.count.next(this.count.value + 1);
    this.events.next('added an item');
  }

  clear() {
    this.count.next(0);
    this.events.next('cleared the cart');
  }
}

// Two separate components that never talk to each other directly.
// They stay in sync because both use the same CartService.

@Component({
  selector: 'app-cart-buttons',
  template: `
    <button (click)="cart.add()">Add to cart</button>
    <button (click)="cart.clear()">Clear</button>
  `,
})
export class CartButtons {
  cart = inject(CartService);
}

@Component({
  selector: 'app-cart-badge',
  imports: [AsyncPipe],
  template: `
    <p>
      Cart items: <strong>{{ cart.count$ | async }}</strong>
    </p>
    <div class="log">{{ (cart.history$ | async)?.join('\\n') }}</div>
  `,
})
export class CartBadge {
  cart = inject(CartService);
}

@Component({
  selector: 'app-subject-demo',
  imports: [CartButtons, CartBadge],
  template: `
    <section>
      <h2>3. Subject: share data between components</h2>
      <app-cart-buttons />
      <app-cart-badge />
    </section>
  `,
})
export class SubjectDemo {}
