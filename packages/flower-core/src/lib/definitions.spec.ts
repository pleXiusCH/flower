import { sampleFlowerGraphDef } from './implementations'
import { serializeToJSONObject } from './utilities'

describe('Definitions', () =>  {
  it('should create a sample flower graph definition object', () => {
    console.log(serializeToJSONObject(sampleFlowerGraphDef, 2))
    expect(sampleFlowerGraphDef).toBeDefined()
  });
});
