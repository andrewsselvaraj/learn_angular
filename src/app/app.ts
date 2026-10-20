import { Component } from '@angular/core';
import { ObservableBasics } from './lessons/01-observable-basics';
import { Operators } from './lessons/02-operators';
import { SubjectDemo } from './lessons/03-subject';
import { AsyncPipeDemo } from './lessons/04-async-pipe';
import { HttpDemo } from './lessons/05-http';

@Component({
  selector: 'app-root',
  imports: [ObservableBasics, Operators, SubjectDemo, AsyncPipeDemo, HttpDemo],
  template: `
    <h1>RxJS in Angular: the basics</h1>
    <p>
      Each card is one lesson. Open the matching file in <code>src/app/lessons/</code> while you
      play with it.
    </p>
    <app-observable-basics />
    <app-operators />
    <app-subject-demo />
    <app-async-pipe-demo />
    <app-http-demo />
  `,
})
export class App {}
