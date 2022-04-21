import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import Graph, * as G from '../../lib/graph';

export const SimpleGraph = {
  node1: { id: 'n1' },
  node2: { id: 'n2' },
  node3: { id: 'n3' },
  node4: { id: 'n4' },
  node5: { id: 'n5' },
  edge1: {
    from: { nodeId: 'n1' },
    to: { nodeId: 'n2' },
  },
  edge2: {
    from: { nodeId: 'n1' },
    to: { nodeId: 'n3' },
  },
  edge3: {
    from: { nodeId: 'n2' },
    to: { nodeId: 'n3' },
  },
};

export const buildSimpleGraph: () => Graph = () => {
  return pipe(
    G.empty(),
    G.insertNode(SimpleGraph.node1),
    G.insertNode(SimpleGraph.node2),
    G.insertNode(SimpleGraph.node3),
    O.of,
    O.chain(G.insertEdge(SimpleGraph.edge1)),
    O.chain(G.insertEdge(SimpleGraph.edge2)),
    O.chain(G.insertEdge(SimpleGraph.edge3)),
    O.getOrElse(() => {
      console.log("FAILED TO BUILD GRAPH")
      return G.empty()
    })
  );
};
