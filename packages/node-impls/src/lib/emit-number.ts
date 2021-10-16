import { NodeImplBuilder } from "@flower/interfaces"

export const EmitNumberImplBuilder: NodeImplBuilder<number> = () => ({
  name: 'EmitNumber',
  internalState: 1,
  activation: (internalState) => ([['num', internalState]]),
  outputs: [{ name: 'num', type: 'number' }]
})