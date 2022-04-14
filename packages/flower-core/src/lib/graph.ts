import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { Codec } from 'io-ts/Codec';
import { Decoder } from 'io-ts/Decoder';
import { Encoder } from 'io-ts/Encoder';
import { Map, Set } from 'immutable';

import * as IM from './ImmutableMap';
// import { Node } from './node';
// import { Edge } from './edge';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export interface Graph<Id, Edge, Node> {
  readonly _brand: unique symbol;
  readonly nodes: Map<string, NodeContext<Node>>;
  readonly edges: Map<string, Map<string, Edge>>;
}

export { Graph as default };

export type Direction<T> = { from: T; to: T };

type NodeContext<Node> = {
  data: Node;
  outgoing: Set<string>;
  incoming: Set<string>;
};

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = <Id, Edge, Node>(): Graph<Id, Edge, Node> =>
  unsafeMkGraph({
    nodes: Map<string, NodeContext<Node>>(),
    edges: Map<string, Map<string, Edge>>(),
  });

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------

export const insertNode =
  <Id>(E: Encoder<string, Id>) =>
  <Node>(id: Id, data: Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): Graph<Id, Edge, Node> =>
    unsafeMkGraph({
      nodes: pipe(
        graph.nodes,
        IM.modifyAt(E)(id, ({ incoming, outgoing }) => ({
          incoming,
          outgoing,
          data,
        })),
        O.getOrElse(() =>
          pipe(
            graph.nodes,
            IM.upsertAt(E)(id, {
              data,
              incoming: Set<string>(),
              outgoing: Set<string>(),
            })
          )
        )
      ),
      edges: graph.edges,
    });

export const insertEdge =
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, data: Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    pipe(
      graph.nodes,
      modifyEdgeInNodes(E)(from, to),
      O.map((nodes) =>
        unsafeMkGraph({
          nodes,
          edges: insertEdgeInEdges(E)(from, to, data)(graph.edges),
        })
      )
    );

export const mapEdge =
  <Edge1, Edge2>(fn: (edge: Edge1) => Edge2) =>
  <Id, Node>(graph: Graph<Id, Edge1, Node>): Graph<Id, Edge2, Node> =>
    unsafeMkGraph({
      nodes: graph.nodes,
      edges: graph.edges.map((from) => from.map(fn)),
    });

export const mapNode =
  <Node1, Node2>(fn: (node: Node1) => Node2) =>
  <Id, Edge>(graph: Graph<Id, Edge, Node1>): Graph<Id, Edge, Node2> =>
    unsafeMkGraph({
      nodes: pipe(
        graph.nodes.map(({ incoming, outgoing, data }) => ({
          incoming,
          outgoing,
          data: fn(data),
        }))
      ),
      edges: graph.edges,
    });

export const map = mapNode;

export const modifyAtEdge =
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, update: (e: Edge) => Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    pipe(
      graph.edges,
      IM.lookup(E)(from),
      O.chain(IM.modifyAt(E)(to, update)),
      O.chain((updatedTo) =>
        pipe(
          graph.edges,
          IM.modifyAt(E)(from, () => updatedTo)
        )
      ),
      O.map((edges) => unsafeMkGraph({ nodes: graph.nodes, edges }))
    );

export const modifyAtNode =
  <Id>(E: Encoder<string, Id>) =>
  <Node>(id: Id, update: (n: Node) => Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    pipe(
      graph.nodes,
      IM.modifyAt(E)(id, ({ incoming, outgoing, data }) => ({
        incoming,
        outgoing,
        data: update(data),
      })),
      O.map((nodes) => unsafeMkGraph({ nodes, edges: graph.edges }))
    );

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

export const lookupNode =
  <Id>(E: Encoder<string, Id>) =>
  (id: Id) =>
  <Node>(graph: Graph<Id, unknown, Node>): Option<Node> =>
    pipe(
      graph.nodes,
      IM.lookup(E)(id),
      O.map((node) => node.data)
    );

export const lookupEdge =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id, to: Id) =>
  <Edge>(graph: Graph<Id, Edge, unknown>): Option<Edge> =>
    pipe(graph.edges, IM.lookup(E)(from), O.chain(IM.lookup(E)(to)));

// -----------------------------------------------------------------------------
// destructors
// -----------------------------------------------------------------------------

export const nodeEntries =
  <Id>(D: Decoder<string, Id>) =>
  <Edge, Node>(graph: Graph<Id, Edge, Node>): [Id, Node][] =>
    pipe(
      graph.nodes.map((_) => _.data),
      mapEntries<Id>(D)
    );

export const edgeEntries =
  <Id>(D: Decoder<string, Id>) =>
  <Edge, Node>(graph: Graph<Id, Edge, Node>): [Direction<Id>, Edge][] =>
    pipe(
      graph.edges.toArray(),
      A.chain(([encodedFrom, toMap]) =>
        pipe(
          encodedFrom,
          D.decode,
          E.map((from) =>
            pipe(
              toMap,
              mapEntries(D),
              A.map(([to, edge]) => <[Direction<Id>, Edge]>[{ from, to }, edge])
            )
          ),
          E.getOrElse(() => <[Direction<Id>, Edge][]>[])
        )
      )
    );

export const entries =
  <Id>(C: Codec<string, string, Id>) =>
  <Edge, Node>(
    graph: Graph<Id, Edge, Node>
  ): { nodes: [Id, Node][]; edges: [Direction<Id>, Edge][] } => ({
    nodes: nodeEntries(C)(graph),
    edges: edgeEntries(C)(graph),
  });

// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkGraph = <Id, Edge, Node>(
  graphData: Omit<Graph<Id, Edge, Node>, '_brand'>
): Graph<Id, Edge, Node> => graphData as Graph<Id, Edge, Node>;

const mapEntries =
  <Id>(decoder: Decoder<string, Id>) =>
  <V>(map_: Map<string, V>): [Id, V][] =>
    pipe(
      map_.toArray(),
      A.traverse(E.Applicative)(([encodedKey, value]) =>
        pipe(
          encodedKey,
          decoder.decode,
          E.map((key) => <[Id, V]>[key, value])
        )
      ),
      E.getOrElse(() => <[Id, V][]>[])
    );

const insertIncoming =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id) =>
  <Node>(nodeContext: NodeContext<Node>): NodeContext<Node> => ({
    data: nodeContext.data,
    outgoing: nodeContext.outgoing,
    incoming: nodeContext.incoming.add(E.encode(from)),
  });

const insertOutgoing =
  <Id>(E: Encoder<string, Id>) =>
  (to: Id) =>
  <Node>(nodeContext: NodeContext<Node>): NodeContext<Node> => ({
    data: nodeContext.data,
    outgoing: nodeContext.outgoing.add(E.encode(to)),
    incoming: nodeContext.incoming,
  });

const modifyEdgeInNodes =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id, to: Id) =>
  <Node>(
    nodes: Graph<Id, unknown, Node>['nodes']
  ): Option<Graph<Id, unknown, Node>['nodes']> =>
    pipe(
      nodes,
      IM.modifyAt(E)(from, insertOutgoing(E)(to)),
      O.chain(IM.modifyAt(E)(to, insertIncoming(E)(from)))
    );

const insertEdgeInEdges =
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, data: Edge) =>
  (
    edges: Graph<Id, Edge, unknown>['edges']
  ): Graph<Id, Edge, unknown>['edges'] =>
    pipe(
      edges,
      IM.lookup(E)(from),
      O.getOrElse(() => Map<string, Edge>()),
      IM.upsertAt(E)(to, data),
      (toMap) => IM.upsertAt(E)(from, toMap)(edges)
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
  <Id>(D: Decoder<string, Id>) =>
  (printId: (id: Id) => string) =>
  (graph: Graph<Id, string, string>): string =>
    pipe(
      [
        ...pipe(
          nodeEntries(D)(graph),
          A.map(([id, label]) => `"${printId(id)}" [label="${label}"]`)
        ),
        ...pipe(
          edgeEntries(D)(graph),
          A.map(
            ([{ from, to }, label]) =>
              `"${printId(from)}" -> "${printId(to)}" [label="${label}"]`
          )
        ),
      ],
      (_) => ['digraph {', ..._, '}'],
      (_) => _.join('\n')
    );
