import { EdgeDefinition, NodeDefinition } from '@flower/interfaces';
import { Position } from 'react-flow-renderer';

export const toReactFlowNodes = (nodes: [string, NodeDefinition][]) =>
  nodes.map(([id, node]) => ({
    id,
    data: {
      nodeImplementation: node.impl,
    },
    type: 'flowerNode',
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

export const toReactFlowEdges = (edges: [string, EdgeDefinition][]) =>
  edges.map(([id, edge]) => ({
    id,
    source: edge.from.nodeId,
    sourceHandle: edge.from.portId,
    target: edge.to.nodeId,
    targetHandle: edge.to.portId,
  }));
