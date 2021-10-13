import { GraphDefinition, NodeImplBuilder } from "./definitions"

export const EmitNumberNodeImpl: NodeImplBuilder<number> = (state = 1) => ({
  name: 'EmitNumber',
  internalState: state,
  activation: (internalState) => ([['num', internalState]]),
  outputs: [{ name: 'num', type: 'number' }]
})

export const AdditonNodeImpl: NodeImplBuilder = () => ({
  name: 'Addition',
  activation: (_, inputs) => ([['output', inputs[0][1] + inputs[1][1]]]), // TODO: Determine better format for input values
  inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
  outputs: [{ name: 'c', type: 'number' }]
})

export const TapNodeImpl: NodeImplBuilder = () => ({
  name: 'Tap',
  inputs: [{ name: 'in', type: 'string | number' }],
  sideEffect: (_, inputs) => new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(`view updated with: ${inputs[0][1]}`), 300)
    } catch(e) {
      reject(e)
    }
  })
})

export const sampleFlowerGraphNodeImpls = [
  EmitNumberNodeImpl,
  AdditonNodeImpl,
  TapNodeImpl
]

export const sampleFlowerGraphDef: GraphDefinition = {
  name: 'sampleFlowerGraph',
  nodes: [
    { name: 'emit_a', impl: 'EmitNumber', state: 1 },
    { name: 'emit_b', impl: 'EmitNumber', state: 2 },
    { name: 'add', impl: 'Addition' },
    { name: 'tap', impl: 'Tap' }
  ],
  edges: [
    { from: { node: 'emit_a', port: 'num' }, to: { node: 'add', port: 'a' }},
    { from: { node: 'emit_b', port: 'num' }, to: { node: 'add', port: 'b' }},
    { from: { node: 'add', port: 'c' }, to: { node: 'tap', port: 'in' }}
  ],
}