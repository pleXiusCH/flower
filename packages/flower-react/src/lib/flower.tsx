import './flower.module.scss';
import { useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  NodeTypes,
  Node,
  useNodesState,
  useEdgesState
} from 'react-flow-renderer';
import { GraphDefinition, NodeImplementation } from '@flower/interfaces';
// import * as G from '@flower/core';
import FlowerNode from './Node/Node';
import ChatbotNode from './Node/ChatbotNode';
import { toReactFlowEdges, toReactFlowNodes } from './utils/reactFlowUtils';

import { initialNodes as chatbotInitialNodes, initialEdges as chatbotInitialEdges } from './chatbotFlow';

const nodeTypes: NodeTypes = {
  flowerNode: FlowerNode,
  chatbotNode: ChatbotNode,
};

export interface FlowerProps {
  nodeImpls: any
  graphDefinition: GraphDefinition
}

export function Flower(props: FlowerProps) {
  // const [ graph, setGraph ] = useState(G.fromPredefined())
  // useEffect(() => console.log("Graph-Definition changed:", props.graphDefinition), [props.graphDefinition])
  // useEffect(() => console.log("Node-Implementations changed:", props.nodeImpls), [props.nodeImpls])
  // useEffect(() => console.log("Graph changed:", graph), [graph])

  // nodes={toReactFlowNodes(G.nodeEntries(graph))}
  // edges={toReactFlowEdges(G.edgeEntries(graph))}

  const [nodes, setNodes, onNodesChange] = useNodesState(chatbotInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(chatbotInitialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      attributionPosition="top-right"
      maxZoom={Infinity}
    >
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={20} />
    </ReactFlow>
  )
};

export default Flower;
