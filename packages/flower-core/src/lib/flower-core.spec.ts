import { computeGraphDefinition, createGraph, sampleInternalStates } from './flower-core'
import { sampleFlowerGraphDef } from './definitions'

describe('flower-core', () =>  {
  it('should generate a flower graph', () => {
    console.log(JSON.stringify(createGraph(sampleFlowerGraphDef)))
    expect(createGraph(sampleFlowerGraphDef)).toBeDefined()
  });
  it('should compute the values of a graph from definition with specified internal states', () => {
    const graphComputationResult = computeGraphDefinition(sampleFlowerGraphDef, sampleInternalStates)
    console.log(graphComputationResult)
    expect(graphComputationResult).toBeDefined()
  });
});


// --> make flower env --> load node impls --> load graph definition --> check unique nodes --> check edges sane  --> check graph policies --> check dependent impls --> build execution context --> schedule nodes --> use schedule strategy --> finalize graph execution
// sequential: perform topoligical sorting to get queue --> compose nodes execution --> execute graph function composition --> log execution results --> finalize strategy
// parallel: build dependency map --> schedule all nodes based on dependency map --> execute ready nodes in parallel --> cache execution results --> reschedule after each execution --> finalize strategy
// reactive: build reactive signal graph --> start observing signal graph --> feed in data via state changes --> log results --> wait for stop condition --> finalize strategy