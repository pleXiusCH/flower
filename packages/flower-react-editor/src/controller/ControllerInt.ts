import Graph from "@plexius/flower-core/src";

export default interface ControllerInt<T = any> {
  setGraph(graph: Graph): ControllerInt<T>;
}