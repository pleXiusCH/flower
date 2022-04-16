import { Map } from 'immutable';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as IM from '../lib/ImmutableMap';

describe('ImmutableMap', () => {
  describe('upsertAt', () => {
    test('Should insert two records in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt('hello', 'world'),
          IM.upsertAt('foo', 'bar')
        )
      ).toStrictEqual(
        Map(<[string, string][]>[
          ['hello', 'world'],
          ['foo', 'bar'],
        ])
      );
    });
  });

  describe('modifyAt', () => {
    test('Should update record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt('hello', 'world'),
          IM.upsertAt('foo', 'bar'),
          IM.modifyAt('hello', () => 'yellow')
        )
      ).toStrictEqual(
        O.some(
          Map(<[string, string][]>[
            ['hello', 'yellow'],
            ['foo', 'bar'],
          ])
        )
      );
    });

    test('Should fail updating missing record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt('hello', 'world'),
          IM.upsertAt('foo', 'bar'),
          IM.modifyAt('world', () => 'hello')
        )
      ).toStrictEqual(O.none);
    });
  });

  describe('lookup', () => {
    test('Should lookup existing record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt('hello', 'world'),
          IM.upsertAt('foo', 'bar'),
          IM.lookup('foo')
        )
      ).toStrictEqual(O.some('bar'));
    });

    test('Should fail when looking up missing record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt('hello', 'world'),
          IM.upsertAt('foo', 'bar'),
          IM.lookup('bar')
        )
      ).toStrictEqual(O.none);
    });
  });
});