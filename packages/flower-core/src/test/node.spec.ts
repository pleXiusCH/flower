import { deepStrictEqual } from 'assert';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as node from '../lib/node';

describe('index', () => {
  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty node', () => {
        deepStrictEqual(
          pipe(
            node.empty('n1'),
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

  describe('Combinators', () => {
    // describe('insertNode', () => {
    //   it('should add new nodes', () => {
    //     deepStrictEqual(
    //       pipe(
    //         node.empty(),
    //         node.insertNode('n1', {}),
    //         node.insertNode('n2', {}),
    //         node.entries
    //       ),
    //       {
    //         nodes: [
    //           ['n1', {}],
    //           ['n2', {}],
    //         ],
    //         edges: [],
    //       }
    //     );
    //   });

    //   it('should update an existing node', () => {
    //     deepStrictEqual(
    //       pipe(
    //         node.empty(),
    //         node.insertNode('n1', {}),
    //         node.insertNode('n1', {}),
    //         node.entries
    //       ),
    //       {
    //         nodes: [['n1', {}]],
    //         edges: [],
    //       }
    //     );
    //   });
    // });

    // describe('insertEdge', () => {
    //   it('should add new edges', () => {
    //     deepStrictEqual(
    //       pipe(
    //         node.empty(),
    //         node.insertEdge('e1', {}),
    //         node.insertEdge('e2', {}),
    //         node.entries
    //       ),
    //       {
    //         nodes: [],
    //         edges: [
    //           ['e1', {}],
    //           ['e2', {}],
    //         ],
    //       }
    //     );
    //   });

    //   it('should update an existing edge', () => {
    //     deepStrictEqual(
    //       pipe(
    //         node.empty(),
    //         node.insertEdge('e1', {}),
    //         node.insertEdge('e1', {}),
    //         node.entries
    //       ),
    //       {
    //         nodes: [],
    //         edges: [['e1', {}]],
    //       }
    //     );
    //   });
    // });

    // describe('lookupNode', () => {
    //   it('should return an existing node value', () => {
    //     deepStrictEqual(
    //       pipe(
    //         node.empty(),
    //         node.insertNode('n1', {}),
    //         node.lookupNode('n1')
    //       ),
    //       O.some({})
    //     );
    //   });

    //   it('should lookup none for non-existing node', () => {
    //     deepStrictEqual(
    //       pipe(
    //         node.empty(),
    //         node.insertNode('n1', {}),
    //         node.lookupNode('n2')
    //       ),
    //       O.none
    //     );
    //   });
    // });
  });
});