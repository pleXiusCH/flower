
import * as O from 'fp-ts/Option';
import { Stack } from 'immutable';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export type OriginIdentifier<Id> = {
  type: 'Graph' | 'Node' | 'Port'
  id: Id
}

export type Connection<FromId, ToId> = {
  from: OriginIdentifier<FromId> | Stack<OriginIdentifier<FromId>>
  to: OriginIdentifier<ToId> | Stack<OriginIdentifier<ToId>>
}

export interface Edge<FromId, ToId> {
  readonly _brand: unique symbol
  readonly connection: O.Option<Connection<FromId, ToId>>
}

export {
  Edge as default,
};



// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = 
  <FromId, ToId>(): Edge<FromId, ToId> =>
    unsafeMkEdge({
      connection: O.none
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

const unsafeMkEdge = 
  <FromId, ToId>(edgeData: Omit<Edge<FromId, ToId>, '_brand'>): Edge<FromId, ToId> => 
    edgeData as Edge<FromId, ToId>