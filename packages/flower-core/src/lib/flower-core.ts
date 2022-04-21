import { EdgeDefinition, FlowerExecutionContext, FlowerScheduler, FlowerWorker, GraphDefinition, NodeDefinition, NodeImplementation } from "@flower/interfaces"

export const createNode = (nodeDefinition: NodeDefinition) => ({...nodeDefinition})
export const createEdge = (edgeDefinition: EdgeDefinition) => ({...edgeDefinition})
export const createGraph = (graphDefinition: GraphDefinition) => ({...graphDefinition})

export type FlowerSession = {
  nodeInplementations: NodeImplementation[],
  graphDefinitions: GraphDefinition[],
  scheduler: FlowerScheduler[],
  worker: FlowerWorker[],
  executionContexts: FlowerExecutionContext[]
}

export const createFlowerSession = () => {
  return {
    nodeInplementations: [],
    graphDefinitions: [],
    scheduler: [],
    worker: [],
    executionContexts: []
  } as FlowerSession
}

export const addNodeImplementation = (flower: FlowerSession) => (impl: NodeImplementation) => {
  return { 
    ...flower, 
    nodeImplementations: [...flower.nodeInplementations, impl]
  } as FlowerSession
}

export const addGraphDefinition = (flower: FlowerSession) => (definition: GraphDefinition) => {
  return { 
    ...flower, 
    graphDefinition: [...flower.graphDefinitions, definition]
  } as FlowerSession
}

export const addScheduler = (flower: FlowerSession) => (scheduler: FlowerScheduler) => {
  return {
    ...flower,
    scheduler: [...flower.scheduler, scheduler]
  } as FlowerSession
}

export const addWorker = (flower: FlowerSession) => (impl: NodeImplementation) => {
  return { 
    ...flower, 
    nodeImplementations: [...flower.nodeInplementations, impl]
  } as FlowerSession
}

export const buildExecutionContext = (flower: FlowerSession) => (graph: GraphDefinition) => {
  return {
    ...flower,
    executionContexts: [...flower.executionContexts, {} as FlowerExecutionContext]
  } as FlowerSession
}