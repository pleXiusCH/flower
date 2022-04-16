import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Map } from 'immutable';

export const upsertAt =
  <A>(k: string, a: A) =>
  (m: Map<string, A>): Map<string, A> => {
    if (m.has(k) && m.get(k) === a) {
      return m;
    }
    return m.set(k, a);
  };

export const modifyAt =
  <A>(k: string, f: (a: A) => A) =>
  (m: Map<string, A>): Option<Map<string, A>> => {
    return pipe(
      m.get(k, null),
      O.fromNullable,
      O.map((value) => m.set(k, f(value)))
    );
  };

export const lookup =
  (k: string) =>
  <A>(m: Map<string, A>): Option<A> =>
    pipe(m.get(k, null), O.fromNullable);