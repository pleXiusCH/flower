// -------------------------------------------------------------------------------------
// tests
// -------------------------------------------------------------------------------------

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { createPort } from './port';

describe('Port', () => {
  it('should create a port data object with no initial data', () => {
    const port = createPort<number>()
    expect(port).toBeTruthy()
    expect(pipe(port.data, O.getOrElse(() => 10))).toBe(10)
    console.log(port)
  });
  it('should create a port data object with data eq 10', () => {
    const port = createPort<number>(10)
    expect(port).toBeTruthy()
    expect(pipe(port.data, O.getOrElse(() => 0))).toBe(10)
    console.log(port)
  });
});