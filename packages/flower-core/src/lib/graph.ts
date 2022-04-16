import { flow, pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import { Either } from 'fp-ts/Either';
import { Map, Set } from 'immutable';

import * as IM from './ImmutableMap';
import {
  EdgeDefinition as Edge,
  GraphDefinition,
  NodeDefinition as Node,
  NodeImplBuilder,
} from '@flower/interfaces';
// import { Node } from './node';
// import { Edge } from './edge';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export interface Graph {
  readonly _brand: unique symbol;
  readonly nodes: Map<string, NodeContext>;
  readonly edges: Map<string, Map<string, Edge>>;
}

export { Graph as default };

export type Direction<T> = { from: T; to: T };

type NodeContext = {
  node: Node;
  outgoing: Set<string>;
  incoming: Set<string>;
};

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = (): Graph =>
  unsafeMkGraph({
    nodes: Map<string, NodeContext>(),
    edges: Map<string, Map<string, Edge>>(),
  });

// export const fromDefinition = (
//   graphDefinition: GraphDefinition
// ): Either<string, Graph> => flow(empty, insertNode);

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------

export const insertNode =
  (node: Node) =>
  (graph: Graph): Graph =>
    unsafeMkGraph({
      nodes: pipe(
        graph.nodes,
        IM.modifyAt(node.id, ({ incoming, outgoing }) => ({
          incoming,
          outgoing,
          node,
        })),
        O.getOrElse(() =>
          pipe(
            graph.nodes,
            IM.upsertAt(node.id, {
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
  (from: string, to: string, data: Edge) =>
  (graph: Graph): Option<Graph> =>
    pipe(
      graph.nodes,
      modifyEdgeInNodes(from, to),
      O.map((nodes) =>
        unsafeMkGraph({
          nodes,
          edges: insertEdgeInEdges(from, to, data)(graph.edges),
        })
      )
    );

export const modifyAtEdge =
  (from: string, to: string, update: (e: Edge) => Edge) =>
  (graph: Graph): Option<Graph> =>
    pipe(
      graph.edges,
      IM.lookup(from),
      O.chain(IM.modifyAt(to, update)),
      O.chain((updatedTo) =>
        pipe(
          graph.edges,
          IM.modifyAt(from, () => updatedTo)
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

export const nodeEntries =
  (graph: Graph): [string, Node][] =>
    pipe(
      graph.nodes.map((_) => _.node),
      mapEntries
    );

export const edgeEntries =
  (graph: Graph): [Direction<string>, Edge][] =>
    pipe(
      graph.edges.toArray(),
      A.chain(([from, toMap]) =>
        pipe(
          toMap,
          mapEntries,
          A.map(([to, edge]) => <[Direction<string>, Edge]>[{ from, to }, edge])
        )
      )
    );

export const entries =
  (
    graph: Graph
  ): { nodes: [string, Node][]; edges: [Direction<string>, Edge][] } => ({
    nodes: nodeEntries(graph),
    edges: edgeEntries(graph),
  });

// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkGraph = (
  graphData: Omit<Graph, '_brand'>
): Graph => graphData as Graph;

const mapEntries =
  <V>(map_: Map<string, V>): [string, V][] =>
    pipe(
      map_.toArray()
    );

const insertIncoming =
  (from: string) =>
  (nodeContext: NodeContext): NodeContext => ({
    node: nodeContext.node,
    outgoing: nodeContext.outgoing,
    incoming: nodeContext.incoming.add(from),
  });

const insertOutgoing =
  (to: string) =>
   (nodeContext: NodeContext): NodeContext => ({
    node: nodeContext.node,
    outgoing: nodeContext.outgoing.add(to),
    incoming: nodeContext.incoming,
  });

const modifyEdgeInNodes =
  (from: string, to: string) =>
  (
    nodes: Graph['nodes']
  ): Option<Graph['nodes']> =>
    pipe(
      nodes,
      IM.modifyAt(from, insertOutgoing(to)),
      O.chain(IM.modifyAt(to, insertIncoming(from)))
    );

const insertEdgeInEdges =
  (from: string, to: string, data: Edge) =>
  (
    edges: Graph['edges']
  ): Graph['edges'] =>
    pipe(
      edges,
      IM.lookup(from),
      O.getOrElse(() => Map<string, Edge>()),
      IM.upsertAt(to, data),
      (toMap) => IM.upsertAt(from, toMap)(edges)
    );

// -----------------------------------------------------------------------------
// debug
// -----------------------------------------------------------------------------

/**
 * For debugging purpose we provide a simple and dependency free dot file
 * generator as its sort of the standard CLI tool to layout graphs visually. See
 * [graphviz](https://graphviz.org) for more details.
 *
 * If your your edges and nodes are not of type string, you can use `mapEdge`
 * and `mapNode` to convert them. That's not possible with the id, as it would
 * possible change the structure of the graph, thus you need to provide a
 * function that stringifies the ids.
 *
 * @since 0.1.0
 * @category Debug
 */
export const toDotFile =
  (printId: (id: string) => string) =>
  (graph: Graph): string =>
    pipe(
      [
        ...pipe(
          nodeEntries(graph),
          A.map(([id, label]) => `"${printId(id)}" [label="${label}"]`)
        ),
        ...pipe(
          edgeEntries(graph),
          A.map(
            ([{ from, to }, label]) =>
              `"${printId(from)}" -> "${printId(to)}" [label="${label}"]`
          )
        ),
      ],
      (_) => ['digraph {', ..._, '}'],
      (_) => _.join('\n')
    );
