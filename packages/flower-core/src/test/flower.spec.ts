import { deepStrictEqual } from 'assert';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as C from 'io-ts/Codec';
import * as G from '../lib/graph';
import * as node from '../lib/node';
import * as edge from '../lib/edge';

// import { gdAddAndLog, gdAddAndLogNodeImpls } from '@flower/node-impls'

describe('index', () => {
  describe('Main', () => {
    it('should define a simple graph', () => {
      type MyId = string;
      type MyStates = number;
      type MyData = number; 
      type MyGraph = G.Graph<MyId, MyStates, MyData>;
      const MyIdCodec: C.Codec<string, string, string> = C.string;

      const empty = G.empty() as MyGraph;
      const insertNode = G.insertNode(MyIdCodec);
      const insertEdge = G.insertEdge(MyIdCodec);

      const myGraph: O.Option<MyGraph> = pipe(
        empty,
        insertNode('EmitNum_1', node.empty()),
        insertNode('EmitNum_2', node.empty()),
        insertNode('AddTwoNum', node.empty()),
        insertNode('LogNum', node.empty()),
        O.of,
        O.chain(insertEdge('e1-add', edge.empty())),
        O.chain(insertEdge('e2-add', edge.empty())),
        O.chain(insertEdge('add-log', edge.empty())),
      );

      deepStrictEqual(
        pipe(
          myGraph,
          
        ),
        {
          nodes: [],
          edges: [],
        }
      );
    });
  });
});