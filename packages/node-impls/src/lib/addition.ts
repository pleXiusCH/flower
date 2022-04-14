import { NodeImplBuilder } from '@flower/interfaces';

export const AdditionImplBuilder: NodeImplBuilder = () => ({
  name: 'Addition',
  activation: (_, inputs) => [['output', inputs[0][1] + inputs[1][1]]], // TODO: Determine better format for input values and return
  inputs: [
    { id: 'a', dataType: 'number' },
    { id: 'b', dataType: 'number' },
  ],
  outputs: [{ id: 'c', dataType: 'number' }],
});
