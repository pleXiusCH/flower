import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { Codec } from 'io-ts/Codec';
import { Decoder } from 'io-ts/Decoder';
import { Encoder } from 'io-ts/Encoder';
import { Map, Set } from 'immutable';

import * as IM from './ImmutableMap';
import { Node } from './node';
import { Edge } from './edge';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export interface Graph<Id, State, IO> {
  readonly _brand: unique symbol
  readonly nodes: Map<string, NodeContext<State, IO>>
  readonly edges: Map<string, Edge<Id,Id>>
}

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const empty = 
  <Id, State, IO>(): Graph<Id, State, IO> =>
  unsafeMkGraph({
    nodes: Map<string, NodeContext<State, IO>>(),
    edges: Map<string, Edge<Id,Id>>(),
  });

type NodeContext<State, IO> = {
  node: Node<State, IO>;
  outgoingEdges: Set<string>;
  incomingEdges: Set<string>;
};



// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------

export const insertNode =
  <Id>(E: Encoder<string, Id>) =>
  <State, IO>(id: Id, node: Node<State, IO>) =>
  (graph: Graph<Id, State, IO>): Graph<Id, State, IO> =>
    unsafeMkGraph({
      nodes: pipe(
        graph.nodes,
        IM.modifyAt(E)(id, (nodeContext) => ({
          ...nodeContext,
          node,
        })),
        O.getOrElse(() =>
          pipe(
            graph.nodes,
            IM.upsertAt(E)(id, {
              node,
              incomingEdges: Set<string>(),
              outgoingEdges: Set<string>(),
            })
          )
        )
      ),
      edges: graph.edges,
    });

export const insertEdge =
  <Id>(E: Encoder<string, Id>) =>
  (id: Id, edge: Edge<Id,Id>) =>
  <State, IO>(graph: Graph<Id, State, IO>): O.Option<Graph<Id, State, IO>> =>
    pipe(
      graph.nodes,
      modifyEdgeInNodes(E)(edge),
      O.map((nodes) =>
        unsafeMkGraph({
          nodes,
          edges: insertEdgeInEdges(E)(edge)(graph.edges),
        })
      )
    );

    unsafeMkGraph({
      nodes: graph.nodes,
      edges: pipe(
        graph.edges,
        IM.modifyAt(E)(id, (currentEdge) => ({
          ...currentEdge,
          ...edge
        })),
        O.getOrElse(() => 
          pipe(
            graph.edges,
            IM.upsertAt(E)(id, edge)
          )
        )
      ),
    });

export const modifyAtEdge =
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, update: (e: Edge) => Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): O.Option<Graph<Id, Edge, Node>> =>
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
  
  /**
   * Modifies a single node in the graph.
   *
   * @since 0.2.0
   * @category Combinators
   */
export const modifyAtNode =
  <Id>(E: Encoder<string, Id>) =>
  <Node>(id: Id, update: (n: Node) => Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): O.Option<Graph<Id, Edge, Node>> =>
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
  <Id, State, IO>(graph: Graph<Id, State, IO>): O.Option<Node<State, IO>> =>
    pipe(
      graph.nodes,
      IM.lookup(E)(id)
    );

export const lookupEdge =
  <Id>(E: Encoder<string, Id>) =>
  (id: Id) =>
  <Id, State, IO>(graph: Graph<Id, State, IO>): O.Option<Edge<Id,Id>> =>
    pipe(
      graph.edges,
      IM.lookup(E)(id)
    );

// -----------------------------------------------------------------------------
// destructors
// -----------------------------------------------------------------------------

export const nodeEntries =
  <Id>(D: Decoder<string, Id>) =>
  <State, IO>(graph: Graph<Id, State, IO>): [Id, Node<State, IO>][] => 
    pipe(
      graph.nodes,
      mapEntries<Id>(D)
    )

export const edgeEntries =
  <Id>(D: Decoder<string, Id>) =>
  <State, IO>(graph: Graph<Id, State, IO>): [Id, Edge<Id,Id>][] =>
    pipe(
      graph.edges,
      mapEntries<Id>(D)
    )

export const entries =
  <Id>(C: Codec<string, string, Id>) =>
  <State, IO>(graph: Graph<Id, State, IO>): { nodes: [Id, Node<State, IO>][]; edges: [Id, Edge<Id,Id>][] } => 
    ({
      nodes: nodeEntries(C)(graph),
      edges: edgeEntries(C)(graph),
    });


// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkGraph = 
  <Id, State, IO>(graphData: Omit<Graph<Id, State, IO>, '_brand'>): Graph<Id, State, IO> => 
    graphData as Graph<Id, State, IO>

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
    )

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