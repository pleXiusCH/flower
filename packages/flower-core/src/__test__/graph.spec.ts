import Graph from "../graph";
import { INodeImpl } from "@plexius/flower-interfaces";
import Node from "../node";

const nodeImpl: INodeImpl = {
  type: 'simple',
};

test('should create a simple node in the graph', () => {
  const graph = new Graph();
  const node = graph.createNode(nodeImpl);
  expect(graph.getNode(node.uuid)).toBeInstanceOf(Node);
});