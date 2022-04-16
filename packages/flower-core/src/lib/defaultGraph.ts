import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import Graph, * as G from './graph';

const node1 = { id: 'n1', impl: 'null' };
const node2 = { id: 'n2', impl: 'null' };
const node3 = { id: 'n3', impl: 'null' };
const edge1 = {
  from: { node: 'n1', port: 'null' },
  to: { node: 'n2', port: 'null' },
};
const edge2 = {
  from: { node: 'n1', port: 'null' },
  to: { node: 'n3', port: 'null' },
};
const edge3 = {
  from: { node: 'n2', port: 'null' },
  to: { node: 'n3', port: 'null' },
};

// Build Graph
export const DefaultGraph: Option<Graph> = pipe(
  G.empty(),
  G.insertNode(node1),
  G.insertNode(node2),
  G.insertNode(node3),
  O.of,
  O.chain(G.insertEdge('n1', 'n2', edge1)),
  O.chain(G.insertEdge('n1', 'n3', edge2)),
  O.chain(G.insertEdge('n2', 'n3', edge3))
);
