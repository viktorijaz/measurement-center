import { TestScheduler } from 'rxjs/testing';
import { combineLatest } from 'rxjs';
import { throttleTime, map, debounceTime } from 'rxjs/operators';

/*
NOTE from the docs!!!: You may have to subtract 1 millisecond from the time you want to progress because 
the alphanumeric marbles (representing an actual emitted value) advance time 1 virtual frame 
themselves already, after they emit. 
This can be very unintuitive and frustrating, but for now it is indeed correct.
DEVELOPER NOTE: not always correct, need to be investigated
*/

describe('Unit marble testing for observables', () => {
  let testScheduler;

  beforeEach(
    () =>
      (testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      }))
  );

  it('combineLatest with throttleTime produces expected result', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      let input_1$ = cold('200ms a 300ms b|');
      let input_2$ = cold('100ms c 350ms d|');
      let input_3$ = cold('100ms e 500ms f|');

      let expected$ = '200ms x 250ms y 49ms z 99ms p|';
      let compounded$ = combineLatest(input_1$, input_2$, input_3$);
      let expectedThrottled$ = '200ms x 250ms y 149ms p|';
      let compoundedThrottled$ = combineLatest(
        input_1$,
        input_2$,
        input_3$
      ).pipe(throttleTime(140));

      expectObservable(compounded$).toBe(expected$, {
        x: ['a', 'c', 'e'],
        y: ['a', 'd', 'e'],
        z: ['b', 'd', 'e'],
        p: ['b', 'd', 'f'],
      });

      expectObservable(compoundedThrottled$).toBe(expectedThrottled$, {
        x: ['a', 'c', 'e'],
        y: ['a', 'd', 'e'],
        z: ['b', 'd', 'e'],
        p: ['b', 'd', 'f'],
      });
    });
  });

  it('produces NaN value when stream did not emitted for more than 1000ms', () => {
    const produceNaN = (observ) => {
      return observ.pipe(
        debounceTime(1000),
        map((i) => 'NaN')
      );
    };
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      let input$ = cold('200ms a 1000ms b 100ms c 1500ms d 250ms e');

      let expected$ = '1200ms x 1101ms y 1751ms z';
      let compounded$ = produceNaN(input$);

      expectObservable(compounded$).toBe(expected$, {
        x: 'NaN',
        y: 'NaN',
        z: 'NaN',
      });
    });
  });
});
