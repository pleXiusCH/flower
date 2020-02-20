import React, { useEffect } from "react";
import { Observable } from "rxjs";
import { Edge as FlowerEdge } from "@plexius/flower-core";
import { useObservable } from "react-use";
import styled from "styled-components";
import Edge from "./Edge";

export interface IEdgesProps {
  edges$: Observable<Map<string, FlowerEdge>>
};

const Svg = styled.svg`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3000;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const Edges: React.SFC<IEdgesProps> = (props) => {
  const edges = useObservable<Map<string, FlowerEdge>>(props.edges$, new Map());
  return (
    <Svg>
      {[...edges].map(([uuid, edge]) => <Edge uuid={uuid} edge={edge} key={uuid} />)}
    </Svg>
  );
};

export default Edges;