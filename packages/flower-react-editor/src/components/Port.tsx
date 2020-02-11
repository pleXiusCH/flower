import React, { useState } from "react";
import styled, { css } from "styled-components";
import { IPortDescriptor, PortType } from "@plexius/flower-interfaces";
import { useController, Ctl } from "../controller/ControllerContext";
import ConnectionsController from "../controller/ConnectionsController";

export interface PortProps extends IPortDescriptor {
  name: string;
  label: string;
  type: PortType;
}

const Container = styled.div<{ active: boolean, type: PortType }>`
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

const PortStatus = styled.div<{ active: boolean }>`
  width: 14px;
  height: 14px;
  box-shadow: 0 1px 7px rgba(0,0,0,.15);
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 50%;
  background-color: #fff;
  z-index: 2000;
  ${props => props.active && css`
    background-color: #808080;
  `};
`;

const Port: React.SFC<PortProps> = (props) => {
  const [active, setActive] = useState<boolean>(false);
  const connectionsController: ConnectionsController = useController(Ctl.Connections) as ConnectionsController;

  const activate = (descriptor: IPortDescriptor, type: PortType): void => {
    connectionsController.activate(descriptor, type) ? setActive(true) : setActive(false);
  }
  const deactivate = (descriptor: IPortDescriptor, type: PortType): void => {
    connectionsController.deactivate(descriptor, type) ? setActive(false) : setActive(true);
  };

  const portDescriptor: IPortDescriptor = {
    nodeId: props.nodeId,
    name: props.name
  };

  return (
    <Container active={active} type={props.type}>
      <PortStatus active={active} onClick={() => active ? deactivate(portDescriptor, props.type) : activate(portDescriptor, props.type)}></PortStatus>
      <Label>{props.label}</Label>
    </Container>
  );
};

export default Port;