import { deepStrictEqual } from 'assert';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as edge from '../lib/edge';

describe('index', () => {
  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty edge', () => {
        deepStrictEqual(
          pipe(
            edge.empty(),
          ),
          {
            activationFn: O.none,
            name: 'n1',
            ports: O.none,
            state: O.none
          }
        );
      });
    });
  });

  // describe('Combinators', () => {
  // });
});