import { AdditionImpl, EmitNumberImpl, TapImpl } from "@plexius/flower-nodes";
import Graph from "../graph";
import { PortType } from "@plexius/flower-interfaces";

export const createAdditionGraph = () => {
  const graph = new Graph();
  const emit1 = graph.createNode(EmitNumberImpl);
  const emit2 = graph.createNode(EmitNumberImpl);
  const add = graph.createNode(AdditionImpl);
  const tap = graph.createNode(TapImpl);
  graph.createEdge(
    { nodeId: emit1.uuid, name: 'number', type: PortType.Output }, 
    { nodeId: add.uuid, name: 'a', type: PortType.Input },
  );
  graph.createEdge(
    { nodeId: emit2.uuid, name: 'number', type: PortType.Output }, 
    { nodeId: add.uuid, name: 'b', type: PortType.Input },
  );
  graph.createEdge(
    { nodeId: add.uuid, name: 'sum', type: PortType.Output }, 
    { nodeId: tap.uuid, name: 'data', type: PortType.Input },
  );
  return [graph];
}