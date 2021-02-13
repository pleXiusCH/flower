import Graph from "../graph";
import { INodeImpl, PortType } from "@plexius/flower-interfaces";
import Node from "../node";
import Edge from "../edge";
import { audit } from "rxjs/operators";
import { interval, Observable, OperatorFunction } from "rxjs";

const simpleOutputNodeImpl: INodeImpl = {
  type: 'simpleOutput',
  outputs: {
    output: {
      type: 'number',
      label: 'number'
    }
  }
};

const simpleInputNodeImpl: INodeImpl = {
  type: 'simpleInput',
  inputs: {
    input: {
      type: 'number',
      label: 'number'
    }
  }
};

const defaultSetupGraphOptions = {
  outputNodeImpl: simpleOutputNodeImpl,
  inputNodeImpl: simpleInputNodeImpl,
  createEdge: true,
}

function setupTestGraph(options = {}) {
  const setup = { ...defaultSetupGraphOptions, ...options};
  const graph = new Graph();
  const outputNode = graph.createNode(setup.outputNodeImpl);
  const inputNode = graph.createNode(setup.inputNodeImpl);
  const edge = setup.createEdge ? graph.createEdge(
    { nodeId: outputNode.uuid, name: 'output', type: PortType.Output }, 
    { nodeId: inputNode.uuid, name: 'input', type: PortType.Input },
  ) : null;
  return {
    graph: graph,
    nodes: [
      outputNode,
      inputNode
    ],
    edges: [
      edge
    ]
  }
}

test('should create tow simple nodes in the graph', () => {
  const testGraph = setupTestGraph({createEdge: false});
  expect(testGraph.graph.getNode(testGraph.nodes[0].uuid)).toBeInstanceOf(Node);
  expect(testGraph.graph.getNode(testGraph.nodes[1].uuid)).toBeInstanceOf(Node);
});

test('should create an edge between two nodes in the graph', () => {
  const testGraph = setupTestGraph();
  const edge = testGraph.edges[0];
  expect(edge).toBeInstanceOf(Edge);
  expect(testGraph.graph.getEdge(edge!.uuid)).toBeInstanceOf(Edge);
});

test('should create an edge with a modifier between two nodes in the graph', () => {
  const testGraph = setupTestGraph({edgeModifier: audit(() => interval(1000))});
  const edge = testGraph.edges[0];
  expect(edge).toBeInstanceOf(Edge);
  expect(testGraph.graph.getEdge(edge!.uuid).getModifier()).not.toBeNull();
});

test('should get the nodes observable in the graph', () => {
  const graph = new Graph();
  expect(graph.getNodes$()).toBeInstanceOf(Observable);
});

test('should get the edges observable in the graph', () => {
  const graph = new Graph();
  expect(graph.getEdges$()).toBeInstanceOf(Observable);
});

test('should get all connected edges to a node in the graph', () => {
  const testGraph = setupTestGraph();
  const connectedEdgesOutputNode$ = testGraph.graph.getConnectedEdges$(testGraph.nodes[0].uuid);
  connectedEdgesOutputNode$.subscribe((edges) => {
    expect(edges.length).toBe(1);
    expect(edges[0]).toBeInstanceOf(Edge);
  }).unsubscribe();
});