import { GraphDefinition } from "@flower/interfaces"
import { AdditionImplBuilder } from "../lib/addition"
import { EmitNumberImplBuilder } from "../lib/emit-number"
import { LogImplBuilder } from "../lib/log"

export const AddAndLogNodeImpls = {
  EmitNumberImplBuilder,
  AdditionImplBuilder,
  LogImplBuilder
}

export const AddAndLogGD: GraphDefinition = {
  name: 'sampleFlowerGraph',
  nodes: [
    { id: 'emit_a', impl: 'EmitNumber', state: 1 },
    { id: 'emit_b', impl: 'EmitNumber', state: 2 },
    { id: 'add', impl: 'Addition' },
    { id: 'tap', impl: 'Log' }
  ],
  edges: [
    { from: { nodeId: 'emit_a', portId: 'num' }, to: { nodeId: 'add', portId: 'a' }},
    { from: { nodeId: 'emit_b', portId: 'num' }, to: { nodeId: 'add', portId: 'b' }},
    { from: { nodeId: 'add', portId: 'c' }, to: { nodeId: 'tap', portId: 'in' }}
  ],
}