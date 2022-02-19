import './flower-react.module.scss';
import React, { useEffect, useState } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Elements,
  Edge,
  Connection,
  OnLoadFunc
} from 'react-flow-renderer';

import { computeFlowerGraph } from '@flower/core'

const onLoad: OnLoadFunc = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

export interface FlowerReactProps<T = any> {
  initialElements: Elements<T> | (() => Elements<T>);
  flowerInstance?: any;
}

export function FlowerReact(props: FlowerReactProps) {
  const [elements, setElements] = useState<Elements>(props.initialElements);
  const [flowerInstance, setFlowerInstance] = useState<any>(computeFlowerGraph());
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));

  useEffect(() => {
    console.log("new flower instance:", flowerInstance)
  }, [flowerInstance])

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      snapGrid={[15, 15]}
    >
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default FlowerReact;