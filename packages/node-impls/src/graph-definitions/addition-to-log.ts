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
    { name: 'emit_a', impl: 'EmitNumber', state: 1 },
    { name: 'emit_b', impl: 'EmitNumber', state: 2 },
    { name: 'add', impl: 'Addition' },
    { name: 'tap', impl: 'Log' }
  ],
  edges: [
    { from: { node: 'emit_a', port: 'num' }, to: { node: 'add', port: 'a' }},
    { from: { node: 'emit_b', port: 'num' }, to: { node: 'add', port: 'b' }},
    { from: { node: 'add', port: 'c' }, to: { node: 'tap', port: 'in' }}
  ],
}