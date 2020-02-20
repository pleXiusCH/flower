import { Node as FlowerNode } from '@plexius/flower-core';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';
import styled from "styled-components";
import { Ports } from './Ports';
import { PortType } from '@plexius/flower-interfaces';
import { useController, Ctl } from '../controller/ControllerContext';
import ConnectionsController from '../controller/ConnectionsController';

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

const PortsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1em;
  margin: 0;

  & > div:nth-child(1) {
    transform: translateX(-8px);
  }

  & > div:nth-child(2) {
    transform: translateX(8px);
  }
`;

const getInitialState = (spec: any) => {
  const state = new Map<string, any>();
  Object.keys(spec).forEach((key) => {
    state.set(key, null);
  });
  return state;
};

const Node: React.FC<NodeProps> = (props) => {
  const sideEffectsContainer = useRef<HTMLDivElement>(null);
  const connectionsController = useController(Ctl.Connections) as ConnectionsController;

  useEffect(() => {
    if (sideEffectsContainer.current) {
      props.node.patchState({
        renderTarget: sideEffectsContainer.current
      });
    }
  }, [sideEffectsContainer, props.node]);

  const handleDrag: DraggableEventHandler = (event) => {
    connectionsController.redrawConnections(props.uuid);
  };

  return (
    <Draggable onDrag={handleDrag}>
      <NodeElement>
        <Head>{props.node.type}</Head>
        <PortsContainer>
          <Ports nodeId={props.uuid} type={PortType.Input} ports={props.node.nodeImpl.inputs || {}} />
          <Ports nodeId={props.uuid} type={PortType.Output} ports={props.node.nodeImpl.outputs || {}} />
        </PortsContainer>
        <div ref={sideEffectsContainer}></div>
      </NodeElement>
    </Draggable>
  );
};

export default Node;