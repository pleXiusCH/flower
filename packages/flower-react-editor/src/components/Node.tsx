import { Node as FlowerNode } from '@plexius/flower-core';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import styled from "styled-components";
import { node } from 'prop-types';
import Port from './Port';
import { IPortSpec, PortType } from '@plexius/flower-interfaces';

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

const renderPorts = (ports: IPortSpec = {}, nodeId: string, type: PortType) => {
  return (
    <div>
      {Object.getOwnPropertyNames(ports).map((key) => (
        <Port {...ports[key]} nodeId={nodeId} name={key} key={key} type={type} />
      ))}
    </div>
  );
};

const Node: React.FC<NodeProps> = (props) => {
  const sideEffectsContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sideEffectsContainer.current) {
      props.node.patchState({
        renderTarget: sideEffectsContainer.current
      });
    }
  }, [sideEffectsContainer, props.node]);

  const InputPorts = useCallback(() => {
    return renderPorts(props.node.nodeImpl.inputs, props.uuid, PortType.Input);
  }, [props.node.nodeImpl.inputs, props.uuid]);

  const OutputPorts = useCallback(() => {
    return renderPorts(props.node.nodeImpl.outputs, props.uuid, PortType.Output);
  }, [props.node.nodeImpl.outputs, props.uuid]);

  return (
    <Draggable>
      <NodeElement>
        <Head>{props.node.type}</Head>
        <PortsContainer>
          <InputPorts />
          <OutputPorts />
        </PortsContainer>
        <div ref={sideEffectsContainer}></div>
      </NodeElement>
    </Draggable>
  );
};

export default Node;