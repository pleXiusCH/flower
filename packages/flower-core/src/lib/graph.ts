import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import { Map, Set } from 'immutable';

import * as IM from './ImmutableMap';
import {
  ConnectionDefinition,
} from '@flower/interfaces';
import { buildAddAndLogGraph } from '../test/data/addToLogGraph';
import { Node } from './node';
import { Edge } from './edge';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export interface Graph {
  readonly _brand: unique symbol;
  readonly nodes: Map<string, NodeContext>;
  readonly edges: Map<string, Edge>;
}

export { Graph as default };

type NodeContext<S = unknown> = {
  node: Node<S>;
  outgoing: Set<string>;
  incoming: Set<string>;
};

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = (): Graph =>
  unsafeMkGraph({
    nodes: Map<string, NodeContext>(),
    edges: Map<string, Edge>(),
  });

export const fromPredefined = (): Graph =>
  buildAddAndLogGraph()

// export const fromDefinition = (
//   graphDefinition: GraphDefinition
// ): Either<string, Graph> => flow(empty, insertNode);

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------

export const insertNode =
  (nodeId: string) =>
  (node: Node) =>
  (graph: Graph): Graph =>
    unsafeMkGraph({
      nodes: pipe(
        graph.nodes,
        IM.modifyAt(nodeId, ({ incoming, outgoing }) => ({
          incoming,
          outgoing,
          node,
        })),
        O.getOrElse(() =>
          pipe(
            graph.nodes,
            IM.upsertAt(nodeId, {
              node,
              incoming: Set<string>(),
              outgoing: Set<string>(),
            })
          )
        )
      ),
      edges: graph.edges,
    });

export const insertEdge =
  (edgeId: string) =>
  (edge: Edge) =>
  (graph: Graph): Option<Graph> =>
    pipe(
      graph.nodes,
      modifyEdgeInNodes(edgeId),
      O.map((nodes) =>
        unsafeMkGraph({
          nodes,
          edges: insertEdgeInEdges(edge)(graph.edges),
        })
      )
    );

export const modifyAtEdge =
  (edge: Edge, update: (e: Edge) => Edge) =>
  (graph: Graph): Option<Graph> =>
    pipe(
      graph.edges,
      IM.lookup(edge.from),
      O.chain(IM.modifyAt(edge.to, update)),
      O.chain((updatedTo) =>
        pipe(
          graph.edges,
          IM.modifyAt(edge.from, () => updatedTo)
        )
      ),
      O.map((edges) => unsafeMkGraph({ nodes: graph.nodes, edges }))
    );

export const modifyAtNode =
  (id: string, update: (n: Node) => Node) =>
  (graph: Graph): Option<Graph> =>
    pipe(
      graph.nodes,
      IM.modifyAt(id, ({ incoming, outgoing, node }) => ({
        incoming,
        outgoing,
        node: update(node),
      })),
      O.map((nodes) => unsafeMkGraph({ nodes, edges: graph.edges }))
    );
    
// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

export const lookupNode =
  (id: string) =>
  (graph: Graph): Option<Node> =>
    pipe(
      graph.nodes,
      IM.lookup(id),
      O.map((node) => node.node)
    );

export const lookupEdge =
  (from: string, to: string) =>
  (graph: Graph): Option<Edge> =>
    pipe(graph.edges, IM.lookup(from), O.chain(IM.lookup(to)));

// -----------------------------------------------------------------------------
// destructors
// -----------------------------------------------------------------------------

export const nodeEntries = (graph: Graph): [string, Node][] =>
  pipe(
    graph.nodes.map((_) => _.node),
    mapEntries
  );

export const edgeEntries = (graph: Graph): [string, Edge][] =>
  pipe(
    graph.edges.toArray(),
    A.chain(([from, toMap]) =>
      pipe(
        toMap,
        mapEntries
      )
    )
  );

export const entries = (
  graph: Graph
): { nodes: [string, Node][]; edges: [string, Edge][] } => ({
  nodes: nodeEntries(graph),
  edges: edgeEntries(graph),
});

// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkGraph = (graphData: Omit<Graph, '_brand'>): Graph =>
  graphData as Graph;

const mapEntries = <V>(map_: Map<string, V>): [string, V][] =>
  pipe(map_.toArray());

const insertIncoming =
  (connection: string) =>
  (nodeContext: NodeContext): NodeContext => ({
    node: nodeContext.node,
    outgoing: nodeContext.outgoing,
    incoming: nodeContext.incoming.add(edgeId),
  });

const insertOutgoing =
  (to: ConnectionDefinition) =>
  (nodeContext: NodeContext): NodeContext => ({
    node: nodeContext.node,
    outgoing: nodeContext.outgoing.add(to.nodeId),
    incoming: nodeContext.incoming,
  });

const modifyEdgeInNodes =
  (edge: Edge) =>
  (nodes: Graph['nodes']): Option<Graph['nodes']> =>
    pipe(
      nodes,
      IM.modifyAt(edge, insertOutgoing(edge.to)),
      O.chain(IM.modifyAt(edge.to.nodeId, insertIncoming(edge.from)))
    );

const insertEdgeInEdges =
  (edgeId: string) =>
  (edge: Edge) =>
  (edges: Graph['edges']): Graph['edges'] =>
    pipe(
      edges,
      IM.lookup(edgeId),
      O.getOrElse(() => Map<string, Edge>()),
      IM.upsertAt(edgeId, edge),
      (toMap) => IM.upsertAt(edge.to.nodeId, toMap)(edges)
    );