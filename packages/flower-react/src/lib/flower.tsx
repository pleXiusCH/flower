import './flower.module.scss';

import { MouseEvent as ReactMouseEvent, CSSProperties } from 'react';

import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Viewport,
  SnapGrid,
  Connection,
  Edge,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  OnSelectionChangeParams,
  Position,
  NodeTypes,
} from 'react-flow-renderer';

import { GraphDefinition, NodeImplementation } from '@flower/interfaces';
import { EmitNumberImplBuilder, AdditionImplBuilder, LogImplBuilder } from '@flower/node-impls';

import FlowerNode from './Node/Node';

const nodeTypes: NodeTypes = {
  flowerNode: FlowerNode,
};

const onNodeDragStart = (_: ReactMouseEvent, node: Node) => console.log('drag start', node);
const onNodeDrag = (_: ReactMouseEvent, node: Node) => console.log('drag', node);
const onNodeDragStop = (_: ReactMouseEvent, node: Node) => console.log('drag stop', node);
const onNodeDoubleClick = (_: ReactMouseEvent, node: Node) => console.log('node double click', node);
const onPaneClick = (event: ReactMouseEvent) => console.log('pane click', event);
const onPaneScroll = (event?: ReactMouseEvent) => console.log('pane scroll', event);
const onPaneContextMenu = (event: ReactMouseEvent) => console.log('pane context menu', event);
const onSelectionDrag = (_: ReactMouseEvent, nodes: Node[]) => console.log('selection drag', nodes);
const onSelectionDragStart = (_: ReactMouseEvent, nodes: Node[]) => console.log('selection drag start', nodes);
const onSelectionDragStop = (_: ReactMouseEvent, nodes: Node[]) => console.log('selection drag stop', nodes);
const onSelectionContextMenu = (event: ReactMouseEvent, nodes: Node[]) => {
  event.preventDefault();
  console.log('selection context menu', nodes);
};
const onNodeClick = (_: ReactMouseEvent, node: Node) => console.log('node click:', node);

const onSelectionChange = ({ nodes, edges }: OnSelectionChangeParams) => console.log('selection change', nodes, edges);
const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log('pane ready:', reactFlowInstance);
};

const onMoveStart = (_: MouseEvent | TouchEvent, viewport: Viewport) => console.log('zoom/move start', viewport);
const onMoveEnd = (_: MouseEvent | TouchEvent, viewport: Viewport) => console.log('zoom/move end', viewport);
const onEdgeContextMenu = (_: ReactMouseEvent, edge: Edge) => console.log('edge context menu', edge);
const onEdgeMouseEnter = (_: ReactMouseEvent, edge: Edge) => console.log('edge mouse enter', edge);
const onEdgeMouseMove = (_: ReactMouseEvent, edge: Edge) => console.log('edge mouse move', edge);
const onEdgeMouseLeave = (_: ReactMouseEvent, edge: Edge) => console.log('edge mouse leave', edge);
const onEdgeDoubleClick = (_: ReactMouseEvent, edge: Edge) => console.log('edge double click', edge);
const onNodesDelete = (nodes: Node[]) => console.log('nodes delete', nodes);
const onEdgesDelete = (edges: Edge[]) => console.log('edges delete', edges);

const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      nodeImplementation: EmitNumberImplBuilder(2)
    },
    type: 'flowerNode',
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '2',
    data: {
      nodeImplementation: EmitNumberImplBuilder(3)
    },
    type: 'flowerNode',
    position: { x: 0, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '3',
    data: {
      nodeImplementation: AdditionImplBuilder()
    },
    type: 'flowerNode',
    position: { x: 300, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '4',
    data: {
      nodeImplementation: LogImplBuilder()
    },
    type: 'flowerNode',
    position: { x: 450, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1num-3a', source: '1', sourceHandle: 'num', target: '3', targetHandle: 'a' },
  { id: 'e2num-3b', source: '2', sourceHandle: 'num', target: '3', targetHandle: 'b' },
  { id: 'e3c-4in', source: '3', sourceHandle: 'c', target: '4', targetHandle: 'in' },
];

const connectionLineStyle: CSSProperties = { stroke: '#ddd' };
const snapGrid: SnapGrid = [16, 16];

const nodeStrokeColor = (n: Node): string => {
  if (n.style?.background) return n.style.background as string;
  if (n.type === 'flowerNode') return '#ff0072';
  return '#eee';
};

const nodeColor = (n: Node): string => {
  if (n.style?.background) return n.style.background as string;
  return '#fff';
};

const OverviewFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onPaneScroll={onPaneScroll}
      onPaneContextMenu={onPaneContextMenu}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onNodeDoubleClick={onNodeDoubleClick}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
      onSelectionChange={onSelectionChange}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
      onInit={onInit}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
      onEdgeContextMenu={onEdgeContextMenu}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseMove={onEdgeMouseMove}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeDoubleClick={onEdgeDoubleClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      attributionPosition="top-right"
      maxZoom={Infinity}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
    >
      <MiniMap nodeStrokeColor={nodeStrokeColor} nodeColor={nodeColor} nodeBorderRadius={2} />
      <Controls />
      <Background color="#aaa" gap={20} />
    </ReactFlow>
  );
};

export interface FlowerProps {
  nodeImpls: NodeImplementation[]
  graphDefinition: GraphDefinition
}

export function Flower(props: FlowerProps) {
  return (
    <OverviewFlow />
  )
};

export default Flower;
