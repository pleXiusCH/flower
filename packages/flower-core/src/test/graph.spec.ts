import { deepStrictEqual } from 'assert';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as C from 'io-ts/Codec';
import * as graph from '../lib/graph';
import * as node from '../lib/node';

const node1 = node.empty('n1')
const node2 = node.empty('n2')

const insertNodeStrId = graph.insertNode(C.string)
const entriesStrId = graph.entries(C.string)

describe('index', () => {
  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty graph', () => {
        deepStrictEqual(
          pipe(
            graph.empty<string, number, number>(),
            graph.entries(C.)
          ),
          {
            nodes: [],
            edges: [],
          }
        );
      });
    });
  });

  describe('Combinators', () => {
    describe('insertNode', () => {
      it('should add new nodes', () => {
        
        deepStrictEqual(
          pipe(
            graph.empty(),
            graph.insertNode(C.string)('n1', node1),
            graph.insertNode('n2', node2),
            graph.entries
          ),
          {
            nodes: [
              ['n1', node1],
              ['n2', node2],
            ],
            edges: [],
          }
        );
      });

      it('should update an existing node', () => {
        deepStrictEqual(
          pipe(
            graph.empty(),
            graph.insertNode('n1', node1),
            graph.insertNode('n1', node1),
            graph.entries
          ),
          {
            nodes: [['n1', node1]],
            edges: [],
          }
        );
      });
    });

    describe('insertEdge', () => {
      it('should add new edges', () => {
        deepStrictEqual(
          pipe(
            graph.empty(),
            graph.insertEdge('e1', {}),
            graph.insertEdge('e2', {}),
            graph.entries
          ),
          {
            nodes: [],
            edges: [
              ['e1', {}],
              ['e2', {}],
            ],
          }
        );
      });

      it('should update an existing edge', () => {
        deepStrictEqual(
          pipe(
            graph.empty(),
            graph.insertEdge('e1', {}),
            graph.insertEdge('e1', {}),
            graph.entries
          ),
          {
            nodes: [],
            edges: [['e1', {}]],
          }
        );
      });
    });

    describe('lookupNode', () => {
      it('should return an existing node value', () => {
        deepStrictEqual(
          pipe(
            graph.empty(),
            graph.insertNode('n1', node1),
            graph.lookupNode('n1')
          ),
          O.some(node1)
        );
      });

      it('should lookup none for non-existing node', () => {
        deepStrictEqual(
          pipe(
            graph.empty(),
            graph.insertNode('n1', node1),
            graph.lookupNode('n2')
          ),
          O.none
        );
      });
    });
  });
});