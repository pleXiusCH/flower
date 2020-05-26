import { Node as FlowerNode } from '@plexius/flower-core';
import React, { useEffect, useRef } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import styled, { css } from "styled-components";
import { Ports } from './Ports';
import { PortType } from '@plexius/flower-interfaces';
import { useRecoilValue } from 'recoil';
import { graphEvents$, GraphEvent, GraphEvents } from '../state/graphState';
import { Subject } from 'rxjs';

export interface NodeProps {
  node: FlowerNode,
  uuid: string;
  onDragEvent?: Function;
}

const NodeElement = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  color: #fff;
  background-color: #1a202b;
  border-radius: 12px;
  box-shadow: 0 1px 7px rgba(0,0,0,.15);
  z-index: 5000;
  min-width: 200px;
  padding-bottom: 8px;
`;

const Head = styled.div`
  background-color: #151a24;
  padding: 1.25em 2em;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1px;
  border-radius: 12px 12px 0 0;
  color: #adadad;
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

const SideEffectsContainer = styled.div<{show:boolean}>`
  ${p => !p.show && css`display:none;` }
  margin: 1em;
  input, textarea {
    background-color: #151a24;
    color: #fff;
    width: 100%;
    padding: 0.5em;
    box-sizing: border-box;
    border: none;
    font-size: 16px;
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
  const _graphEvents$: Subject<GraphEvent> = useRecoilValue(graphEvents$);

  useEffect(() => {
    if (sideEffectsContainer.current) {
      props.node.patchState({
        renderTarget: sideEffectsContainer.current
      });
    }
  }, [sideEffectsContainer, props.node]);

  const handleDrag: DraggableEventHandler = () => {
    _graphEvents$?.next({ key: GraphEvents.NodeDrag, payload: props.uuid });
  };

  return (
    <Draggable onDrag={handleDrag}>
      <NodeElement>
        <Head>{props.node.type}</Head>
        <PortsContainer>
          <Ports nodeId={props.uuid} type={PortType.Input} ports={props.node.nodeImpl.inputs || {}} />
          <Ports nodeId={props.uuid} type={PortType.Output} ports={props.node.nodeImpl.outputs || {}} />
        </PortsContainer>
        <SideEffectsContainer ref={sideEffectsContainer} show={!!props.node.nodeImpl.sideEffectsFunction} />
      </NodeElement>
    </Draggable>
  );
};

export default Node;