import React, { useState, useRef, useEffect, FC, useCallback } from "react";
import styled, { css } from "styled-components";
import { IPortDescriptor, PortType } from "@plexius/flower-interfaces";
import { useController, Ctl } from "../controller/ControllerContext";
import ConnectionsController from "../controller/ConnectionsController";
import { usePortStatus } from "../hooks/PortHooks";

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
  const connectionsController: ConnectionsController = useController(Ctl.Connections) as ConnectionsController;
  const portStatus = usePortStatus(props.descriptor);
  const portRef = useRef<HTMLDivElement>(null);

  const select = useCallback((): void => {
    portStatus && connectionsController.addToSelection(portStatus.descriptor);
  }, [connectionsController, portStatus]);

  const unselect = useCallback((): void => {
    portStatus && connectionsController.removeFromSelection(portStatus.descriptor);
  }, [connectionsController, portStatus]);

  const setPortRef = useCallback((): void => {
    portStatus && connectionsController.setPortReference(portStatus.descriptor, portRef.current);
  }, [connectionsController, portStatus, portRef]);

  useEffect(() => {
    if (portStatus && portRef && portStatus.ref !== portRef.current) {
      setPortRef();
    }
  }, [portStatus, portRef]);

  return (
    <Container type={props.descriptor.type}>
      <PortStatus ref={portRef} isSelected={portStatus?.isSelected} isActive={portStatus?.isActive} onClick={() => portStatus?.isSelected ? unselect() : select()}></PortStatus>
      <Label>{props.label}</Label>
    </Container>
  );
};

export default Port;