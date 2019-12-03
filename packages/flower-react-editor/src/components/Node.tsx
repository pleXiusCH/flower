import { Node as FlowerNode } from '@plexius/flower-core';
import React, { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import styled from "styled-components";
import { node } from 'prop-types';

export interface NodeProps {
  node: FlowerNode,
  uuid: string;
  onDragEvent?: Function;
}

const NodeElement = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: block;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 7px rgba(0,0,0,.15);
  border: 1px solid rgba(0,0,0,.1);
  z-index: 5000;
`;

const Head = styled.div`
  padding: 5px 1em;
  background-color: #808080;
  color: #fff;
  text-align: center;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
`;

const ConnectorsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1em;
  margin: 0;
`;

const getInitialState = (spec: any) => {
  const state = new Map<string, any>();
  Object.keys(spec).forEach((key) => {
    state.set(key, null);
  });
  return state;
};

const Node: React.FC<NodeProps> = (props) => {

  const sideEffectsComponent = useCallback(() => {
    return (
      <div>SEC</div>
    );
  }, [props.node]);
  
  /*const SEC = (Elem: any) => {
    // return <Elem setState={setNodeState} getState={() => nodeState} inputs={mapToObject(inputsState[0])} />;
  }*/

  const handleDragEvent = () => {
    if (typeof props.onDragEvent === 'function') {
      props.onDragEvent(props.uuid);
    }
  };

  return (
    <Draggable>
      <NodeElement>
        <Head>{props.node.uuid}</Head>
        {sideEffectsComponent}
      </NodeElement>
    </Draggable>
  );
};

export default Node;