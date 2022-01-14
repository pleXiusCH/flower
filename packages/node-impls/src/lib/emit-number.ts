import { NodeImplBuilder } from "@flower/interfaces"

export const EmitNumberImplBuilder: NodeImplBuilder<number> = (defaultState = 0) => ({
  name: 'EmitNumber',
  internalState: defaultState,
  activation: (internalState) => ([['num', internalState]]),
  outputs: [{ name: 'num', type: 'number' }]
})