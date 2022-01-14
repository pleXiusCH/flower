import { option, string } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither'
import { Option } from 'fp-ts/Option';
import { Map, Set } from 'immutable';

import * as IM from './ImmutableMap';
import * as P from './port';
import { addScheduler } from './flower-core';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export interface Node<S, P> {
  readonly _brand: unique symbol
  readonly ports: Option<Set<P.Port<P>>>
  readonly state: Option<S>
  readonly activationFn: Option<TaskEither<string, Map<string, P>>>
}

export {
  Node as default,
};

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = 
  <S, P>(): Node<S, P> =>
    unsafeMkNode({
      ports: O.none,
      state: O.none,
      activationFn: O.none
    });

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// destructors
// -----------------------------------------------------------------------------

// const entries =
//   <S, P>(node: Node<S, P>): {
//     name: string,
//     ports: Array<P.Port<P>>,
//     state: S | never,
//     activationFn: never
//   } =>
//     ({
//       name: node.name,
//       ports: pipe(
//         node.ports,
//         O.getRight()
//       ),
//       state: pipe(
//         node.state,
//         O.getOrElse(() => [])
//       ),
//     })


// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkNode = 
  <S, P>(nodeData: Omit<Node<S, P>, '_brand'>): Node<S, P> => 
    nodeData as Node<S, P>;