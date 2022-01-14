// -------------------------------------------------------------------------------------
// tests
// -------------------------------------------------------------------------------------

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as port from './port';
import { deepStrictEqual } from 'assert';

describe('index', () => {

  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty port', () => {
        deepStrictEqual(
          port.empty(),
          {
            data: O.none,
            incoming: O.none,
            outgoing: O.none
          }
        );
      });
    });
  });

  describe('Combinators', () => {
    describe('updateData', () => {
      it('should update data of type int stored inside port', () => {
        deepStrictEqual(
          pipe(
            port.empty<number>(),
            port.updateData(1),
          ),
          {
            data: O.some(1),
            incoming: O.none,
            outgoing: O.none
          }
        );
      });
    });
    describe('addIncoming', () => {
      it('should add an incoming port', () => {
        deepStrictEqual(
          pipe(
            port.empty<number>(),
            port.addIncoming(port.empty<number>())
          ),
          {
            data: O.none,
            incoming: O.some({
              data: O.none,
              incoming: O.none,
              outgoing: O.none
            }),
            outgoing: O.none
          }
        );
      });
    });
  });

});