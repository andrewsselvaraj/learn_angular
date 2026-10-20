import { TestBed } from '@angular/core/testing';
import { filter, firstValueFrom, from, map, toArray } from 'rxjs';
import { App } from './app';
import { CartService } from './lessons/03-subject';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('RxJS in Angular');
  });
});

describe('CartService', () => {
  it('BehaviorSubject gives new subscribers the current value', async () => {
    const cart = TestBed.inject(CartService);
    cart.add();
    cart.add();
    expect(await firstValueFrom(cart.count$)).toBe(2);
  });
});

// Not about Angular at all: plain RxJS is easy to test on its own.
describe('operators', () => {
  it('filter then map', async () => {
    const out = await firstValueFrom(
      from([1, 2, 3, 4]).pipe(
        filter((n) => n % 2 === 0),
        map((n) => n * 10),
        toArray(),
      ),
    );
    expect(out).toEqual([20, 40]);
  });
});
