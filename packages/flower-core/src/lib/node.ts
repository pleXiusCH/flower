import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import { Map } from 'immutable';
import { Port } from './port';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export interface Node<S = unknown> {
  readonly _brand: unique symbol
  readonly id: string
  readonly ports: Option<Map<string, Port>>
  readonly state: Option<S>
  readonly activationFn: Option<() => [string, unknown][]>
  readonly uiInterface: Option<unknown>
}

export {
  Node as default,
};

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = (id: string): Node =>
    unsafeMkNode({
      id,
      ports: O.none,
      state: O.none,
      activationFn: O.none,
      uiInterface: O.none,
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



// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkNode = 
  <S>(nodeData: Omit<Node<S>, '_brand'>): Node<S> => 
    nodeData as Node<S>;