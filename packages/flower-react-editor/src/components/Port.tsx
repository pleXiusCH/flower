import React, { useRef, useEffect, FC, useState, useCallback, useLayoutEffect } from "react";
import styled, { css } from "styled-components";
import { IPortDescriptor, PortType } from "@plexius/flower-interfaces";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { portStateById, portCenterPoint, computeCenterPoint, portIsSelectedById } from "./../state/portsState";
import { graphEvents$, GraphEvent, GraphEvents } from "../state/graphState";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { infinitePlaneOrignPosition, infintePlaneTransformation, TransformationDescriptor } from "../state/infinitePlaneState";
import { ICenterPoint } from "./Edge";

export interface PortProps {
  descriptor: IPortDescriptor,
  label: string
}

const Container = styled.div<{ type: PortType }>`
  position: relative;
  height: 30px;
  display: grid;
  align-items: center;
  grid-gap: 10px;
  grid-template-columns: 15px 1fr;
  ${props => props.type === PortType.Output && css`
    direction: rtl;
  `};
`;

const Label = styled.div`
`;

const PortStatus = styled.div<{ isSelected: boolean, isActive: boolean }>`
  width: 14px;
  height: 14px;
  box-shadow: 0 1px 7px rgba(0,0,0,.15);
  border: 1px solid #505b75;
  border-radius: 50%;
  background-color: #151a24;
  z-index: 2000;
  ${props => props.isActive && css`
    border-color: #21ff00;
  `};
  ${props => props.isSelected && css`
    border-color: #00fffa;
  `};
`;

const Port: FC<PortProps> = (props) => {
  
  // todo: use uuid for port id
  const [id, setId] = useState(`${props.descriptor.nodeId}-${props.descriptor.name}`);
  const portRef = useRef<HTMLDivElement>(null);
  const [ portStatus, setPortStatus ] = useRecoilState(portStateById(id));
  const _graphEvents$: Subject<GraphEvent> = useRecoilValue(graphEvents$);
  const setPortCenterPoint = useSetRecoilState(portCenterPoint(id));
  const [ portIsSelected, setPortIsSelected ] = useRecoilState(portIsSelectedById(id));
  const infinitePlaneOrignPos: ICenterPoint = useRecoilValue(infinitePlaneOrignPosition);
  const _infintePlaneTransformation: TransformationDescriptor = useRecoilValue(infintePlaneTransformation);

  const select = () => {
    setPortIsSelected(true);
  };

  const unselect = () => {
    setPortIsSelected(false);
  };

  useLayoutEffect(() => {
    console.error("chaged....");
  }, [_infintePlaneTransformation]);

  const setCenterPoint = useCallback(() => {
    if (portRef?.current) {
      const computedCenterPoint = computeCenterPoint(portRef.current.getBoundingClientRect());
      if (_infintePlaneTransformation && infinitePlaneOrignPos) {
        const relOrigin: ICenterPoint = {
          x: (infinitePlaneOrignPos.x + _infintePlaneTransformation.x),
          y: (infinitePlaneOrignPos.y + _infintePlaneTransformation.y),
        };
        computedCenterPoint.x = (computedCenterPoint.x - relOrigin.x) / _infintePlaneTransformation.zoom;
        computedCenterPoint.y = (computedCenterPoint.y - relOrigin.y) / _infintePlaneTransformation.zoom;
      }
      setPortCenterPoint(computedCenterPoint);
    }
  }, [portRef, _infintePlaneTransformation, infinitePlaneOrignPos]);

  useEffect(() => {
    const assocNodeDrag$ = _graphEvents$.pipe(
      filter(e => (e.key == GraphEvents.NodeDrag && e.payload == props.descriptor.nodeId))
    ).subscribe(() => setCenterPoint());
    return () => {
      assocNodeDrag$.unsubscribe();
    }
  }, [_graphEvents$, props.descriptor.nodeId, setCenterPoint]);

  useEffect(() => {
    const newId = `${props.descriptor.nodeId}-${props.descriptor.name}`;
    if(id !== newId) {
      setId(newId);
    }
  }, [props.descriptor.nodeId, props.descriptor.name]);

  useEffect(() => {
    setPortStatus({...portStatus, descriptor: props.descriptor, id: id});
  }, [props.descriptor, id]);

  useEffect(() => {
    if (portRef?.current) {
      setCenterPoint();
    }
  }, [portRef]);

  return (
    <Container type={props.descriptor.type}>
      <PortStatus 
        ref={portRef} 
        isSelected={portIsSelected} 
        isActive={false} 
        onClick={() => portIsSelected ? unselect() : select()} 
      />
      <Label>{props.label}</Label>
    </Container>
  );
};

export default Port;