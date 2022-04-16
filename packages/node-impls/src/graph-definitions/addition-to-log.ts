import { GraphDefinition } from "@flower/interfaces"
import { AdditionImplBuilder } from "../lib/addition"
import { EmitNumberImplBuilder } from "../lib/emit-number"
import { LogImplBuilder } from "../lib/log"

export const AddAndLogNodeImpls = [
  EmitNumberImplBuilder,
  AdditionImplBuilder,
  LogImplBuilder
]

export const AddAndLogGD: GraphDefinition = {
  name: 'sampleFlowerGraph',
  nodes: [
    { id: 'emit_a', impl: 'EmitNumber', state: 1 },
    { id: 'emit_b', impl: 'EmitNumber', state: 2 },
    { id: 'add', impl: 'Addition' },
    { id: 'tap', impl: 'Log' }
  ],
  edges: [
    { from: { node: 'emit_a', port: 'num' }, to: { node: 'add', port: 'a' }},
    { from: { node: 'emit_b', port: 'num' }, to: { node: 'add', port: 'b' }},
    { from: { node: 'add', port: 'c' }, to: { node: 'tap', port: 'in' }}
  ],
}