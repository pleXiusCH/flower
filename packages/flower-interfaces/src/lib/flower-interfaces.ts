export type IODataContainer<T = any> = T;

export type InternalNodeStateContainer<T = any> = T;

export type LabeledDataMapping<T = IODataContainer> = [string, T][];

export type NodeActivationFn<I = LabeledDataMapping, O = LabeledDataMapping, S = InternalNodeStateContainer> = (internalState: S, inputs: I) => O | Promise<O>

export type SideEffectFn<I = LabeledDataMapping, S = InternalNodeStateContainer> = (internalState: S, inputs: I) => Promise<S>

export type PortDefinition = {
  id: string,
  dataType: string,
  label?: string,
}

export type NodePortDefinition = {
  node: string
  port: string
}

export type EdgeDefinition = {
  from: NodePortDefinition,
  to: NodePortDefinition
}

export type NodeDefinition<T = InternalNodeStateContainer> = {
  id: string,
  impl: string,
  state?: T
}

export type NodeInterface<T = CustomElementConstructor> = {
  tag: string,
  customElement: T
}

export type NodeImplementation<S = InternalNodeStateContainer> = {
  name: string
  activation?: NodeActivationFn
  internalState?: S,
  inputs?: PortDefinition[]
  outputs?: PortDefinition[]
  interface?: NodeInterface,
}

export type NodeImplBuilder<S = InternalNodeStateContainer> = (state?: S) => NodeImplementation<S>

export type GraphDefinition = {
  name: string
  nodes: NodeDefinition[],
  edges: EdgeDefinition[],
}

export type FlowerScheduler = {
  schedule: (executionContext: FlowerExecutionContext) => void
}

export type FlowerWorker = {
  execute: () => void
}

export type FlowerExecutionContext = {
  execute: () => void
}