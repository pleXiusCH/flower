import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import Graph, * as G from '../../lib/graph';
import Node, * as N from '../../lib/node';

import { AddAndLogGD as GD, AddAndLogNodeImpls as IB } from '@flower/node-impls';

export const buildAddAndLogGraph: () => Graph = () => {
  return pipe(
    G.empty(),
    //G.insertNode(pipe(N.fromDefinition(GD.nodes[0])),
    G.insertNode(GD.nodes[1]),
    G.insertNode(GD.nodes[2]),
    G.insertNode(GD.nodes[3]),
    O.of,
    O.chain(G.insertEdge(GD.edges[0])),
    O.chain(G.insertEdge(GD.edges[1])),
    O.chain(G.insertEdge(GD.edges[2])),
    O.getOrElse(() => {
      console.log("FAILED TO BUILD GRAPH")
      return G.empty()
    })
  );
};
