import { Codec } from 'io-ts/Codec';
import * as Cod from 'io-ts/Codec';

import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';

import Graph, * as G from './graph';

export type DefaultId = string;

export type DefaultNode = { state: string };

export type DefaultEdge = { active: boolean };

// Define codec for encoding and decoding Id to string
export const DefaultIdCodec: Codec<string, string, string> = Cod.string;

// Define customized Graph type
export type DefaultGraph = Graph<DefaultId, DefaultNode, DefaultEdge>;

// Define partially applied functions
const empty = G.empty<DefaultId, DefaultNode, DefaultEdge>();
const insertNode = G.insertNode(DefaultIdCodec);
const insertEdge = G.insertEdge(DefaultIdCodec);

// Build Graph
export const DefaultGraph: Option<DefaultGraph> = pipe(
  empty,
  insertNode('node1', {
    state: 'foo',
  }),
  insertNode('node2', {
    state: 'foo',
  }),
  insertNode('node3', {
    state: 'foo',
  }),
  insertNode('node4', {
    state: 'foo',
  }),
  O.of,
  O.chain(insertEdge('node1', 'node2', { active: true })),
  O.chain(insertEdge('node2', 'node3', { active: true })),
  O.chain(insertEdge('node2', 'node4', { active: true })),
  O.chain(insertEdge('node3', 'node4', { active: true }))
);
