import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import { Option } from 'fp-ts/Option'
import { Set } from 'immutable'

import * as IM from './ImmutableMap'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

export interface Port<T = unknown> {
  readonly _brand: unique symbol
  readonly data: Option<T>
}

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = <T>(): Port<T> =>
  unsafeMkPort({
    data: O.none,
  });

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

export const updateData =
  <T>(data: T) =>
  (port: Port<T>): Port<T> =>
    unsafeMkPort({
      data: O.fromNullable<T>(data),
      incoming: port.incoming,
      outgoing: port.outgoing
    });

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkPort = 
<T>(portData: Omit<Port<T>, '_brand'>): Port<T> => 
  portData as Port<T>;