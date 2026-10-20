# RxJS Basics in Angular

A small Angular app that teaches RxJS one idea at a time. Each lesson is a single,
commented file in `src/app/lessons/`, and each one shows up as a card on the page.
The same guide as a web page: [docs/RxJS-guide.html](docs/RxJS-guide.html).

## Run it

```bash
npm install
npm start          # then open http://localhost:4200
npm test           # runs the small unit tests in src/app/app.spec.ts
```

Requires Node.js 20.19+ or 22.12+.

## The five ideas

### 1. Observable and `subscribe` — `01-observable-basics.ts`

An **Observable** is a stream of values that arrive over time (clicks, timer ticks,
an HTTP response). It is lazy: nothing runs until you call `.subscribe()`.

```ts
const ticks$ = new Observable<string>((subscriber) => {
  subscriber.next('hello');   // send a value
  subscriber.complete();      // no more values
});

const sub = ticks$.subscribe({
  next: (v) => console.log(v),
  error: (e) => console.error(e),
  complete: () => console.log('done'),
});

sub.unsubscribe(); // stop listening
```

The `$` at the end of a name is just a convention meaning "this is an Observable".
If you subscribe by hand, unsubscribe in `ngOnDestroy`, or the stream keeps running
after the component is gone (a memory leak).

### 2. Operators: `map` and `filter` — `02-operators.ts`

Operators go inside `.pipe(...)`. Each one takes a stream in and gives a new stream out,
like `Array.map` and `Array.filter`, but over time.

```ts
from([1, 2, 3, 4, 5, 6])
  .pipe(
    filter((n) => n % 2 === 0), // 2, 4, 6
    map((n) => n * 10),         // 20, 40, 60
  )
  .subscribe(console.log);
```

### 3. `Subject` and `BehaviorSubject` — `03-subject.ts`

A **Subject** is an Observable you push values into yourself with `.next()`.
Put one in a service and any component can send or listen, which is how two unrelated
components share data.

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private count = new BehaviorSubject(0);  // starts at 0
  count$ = this.count.asObservable();     // read-only for everyone else

  add() { this.count.next(this.count.value + 1); }
}
```

- `Subject`: subscribers only get values sent after they subscribed.
- `BehaviorSubject`: always has a current value, and new subscribers get it immediately.
  This is the one you want for state like "items in cart" or "logged-in user".

### 4. The `async` pipe — `04-async-pipe.ts`

The easiest and safest way to use an Observable in a template. Angular subscribes,
shows the latest value, and unsubscribes for you when the component is destroyed.

```ts
seconds$ = interval(1000);
```

```html
<p>Seconds: {{ seconds$ | async }}</p>
```

Rule of thumb: prefer `| async` over manual `.subscribe()` whenever the value is only
needed for display.

### 5. HttpClient — `05-http.ts`

Every `HttpClient` call returns an Observable that emits the response once and
completes. The request is sent only when something subscribes. It needs
`provideHttpClient()` in `app.config.ts`.

```ts
users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
```

The lesson also builds a live search box, the classic RxJS pattern:

```ts
users$ = this.terms.pipe(           // a Subject of typed text
  debounceTime(300),                // wait for typing to pause
  distinctUntilChanged(),           // ignore repeats
  switchMap((term) => this.http.get<User[]>(url)), // cancel the old request, start a new one
  catchError(() => of([])),         // don't let one error kill the stream
);
```

`switchMap` is the key: when a new term arrives it cancels the previous request, so an
old, slow response can never overwrite a newer one.

## Cheat sheet

| You want to…                          | Use                                   |
| ------------------------------------- | ------------------------------------- |
| Make a stream from values or an array | `of(1, 2, 3)`, `from([1, 2, 3])`      |
| Emit on a timer                       | `interval(ms)`, `timer(ms)`           |
| Transform each value                  | `map`                                 |
| Keep only some values                 | `filter`                              |
| Wait for the user to stop typing      | `debounceTime`                        |
| Skip repeated values                  | `distinctUntilChanged`                |
| Turn each value into a request        | `switchMap`                           |
| Handle an error                       | `catchError`                          |
| Share state between components        | `BehaviorSubject` in a service        |
| Show a stream in the template         | `\| async`                            |

## A note about signals

This app is "zoneless" (the Angular 21 default), so the view updates when a **signal**
changes or when the `async` pipe receives a value. That is why lessons 1 and 2 push
results into a `signal()` instead of a plain field. Signals and RxJS work well together:
`toSignal()` and `toObservable()` from `@angular/core/rxjs-interop` convert between them.
