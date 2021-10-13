import { option } from 'fp-ts'
import { Monoid } from 'fp-ts/Monoid'
import { Option } from 'fp-ts/Option'

/*
  Defnies a Flower Port.
  This module is split in 3 parts:
  - the model
  - primitives
  - combinators
*/

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

export interface Port<D> {
  /** Use a symbol to identify Port.*/
  readonly identifier: symbol
  /** Holds data of type <D> that is currently stored in the Port.*/
  readonly data?: Option<D>
  readonly inputSubscription?: Option<string>;
  readonly outputObservable?: Option<string>;
}

export const createPort: <D>(initialData?: D) => Port<D> = (initialData) => ({
  identifier: Symbol('PORT'),
  data: option.fromNullable(initialData)
})

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * 
 */
// export const getPortData = <D>(): Port<D> => () => delay

// /**
//  * Retry immediately, but only up to `i` times.
//  */
// export const limitRetries = (i: number): RetryPolicy => (status) =>
//   status.iterNumber >= i ? undefined : 0

// // -------------------------------------------------------------------------------------
// // combinators
// // -------------------------------------------------------------------------------------

// /**
//  * Set a time-upperbound for any delays that may be directed by the
//  * given policy.
//  */
// export const capDelay = (maxDelay: number) => (
//   policy: RetryPolicy
// ): RetryPolicy => (status) => {
//   const delay = policy(status)
//   return delay === undefined ? undefined : Math.min(maxDelay, delay)
// }

// /**
//  * Merges two policies. **Quiz**: what does it mean to merge two policies?
//  */
// export const concat = (second: RetryPolicy) => (
//   first: RetryPolicy
// ): RetryPolicy => (status) => {
//   const delay1 = first(status)
//   const delay2 = second(status)
//   if (delay1 !== undefined && delay2 !== undefined) {
//     return Math.max(delay1, delay2)
//   }
//   return undefined
// }

