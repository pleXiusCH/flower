export const createNode = (nodeDefinition) => ({...nodeDefinition})
export const createEdge = (edgeDefinition) => ({...edgeDefinition})
export const createGraph = (graphDefinition) => ({...graphDefinition})

export const runWithInternalStates = (graph, internalStates) => {
  return graph.nodes.map(n => {
    return {
      ...n,
      internalState: n.internalState ? internalStates.get(n.key) : null
    }
  })
}

export const sampleInternalStates = new Map([
  ['emit', 'bar']
])

export function computeGraphDefinition(graphDefinition, internalStates) {
  return runWithInternalStates(createGraph(graphDefinition), internalStates)
}
