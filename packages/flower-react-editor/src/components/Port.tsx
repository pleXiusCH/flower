import React, { useState } from "react";
import styled, { css } from "styled-components";

export interface PortProps {
  nodeId: string;
  name: string;
  label: string;
  type: string;
  flipped?: boolean;
}

const Container = styled.div<{ active: boolean, flipped: boolean }>`
  position: relative;
  height: 30px;
  display: grid;
  align-items: center;
  grid-gap: 10px;
  grid-template-columns: 15px 1fr;
  ${props => props.flipped && css`
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

  return (
    <Container active={active} flipped={props.flipped}>
      <PortStatus active={active}></PortStatus>
      <Label>{props.label}</Label>
    </Container>
  );
};

export default Port;