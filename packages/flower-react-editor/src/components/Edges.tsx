import React, { useEffect, useState, useRef } from "react";
import { Observable } from "rxjs";
import { Edge as FlowerEdge } from "@plexius/flower-core";
import { useObservable } from "react-use";
import styled from "styled-components";
import Edge from "./Edge";
import { editorEvents$, EditorEvents } from "../state/editorState";
import { useRecoilState, useRecoilValue } from 'recoil';
import { filter } from "rxjs/operators";
import { infintePlaneTransformationMatrix, TransformationDescriptor, infinitePlaneOrignPosition } from '../state/infinitePlaneState';
import { ICenterPoint } from "../state/portsState";

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

const Origin = styled.g``;

const Edges: React.SFC<IEdgesProps> = (props) => {
  const edges = useObservable<Map<string, FlowerEdge>>(props.edges$, new Map());
  const transformationMatrix: string = useRecoilValue(infintePlaneTransformationMatrix);
  const [relativePosition, setRelativePosition] = useState({x: 0, y: 0});
  const svgRef = useRef<SVGSVGElement>(null);
  const infinitePlaneOrignPos: ICenterPoint = useRecoilValue(infinitePlaneOrignPosition);

  const calcRelativePosition = () => {
    if (svgRef && svgRef.current) {
      const boundingBox = svgRef.current.getBoundingClientRect();
      const position: ICenterPoint = {x: boundingBox.x, y: boundingBox.y};
      if (infinitePlaneOrignPos) {
        position.x = infinitePlaneOrignPos.x - position.x;
        position.y = infinitePlaneOrignPos.y - position.y;
      }
      setRelativePosition(position);
    }
  };

  useEffect(() => {
    calcRelativePosition();
  }, [svgRef, infinitePlaneOrignPos]);
  

  return (
    <Svg ref={svgRef}>
      <Origin style={{transform: `translate(${relativePosition.x}px, ${relativePosition.y}px)`}}>
        <g style={{transform: transformationMatrix}}>
          {[...edges].map(([uuid, edge]) => <Edge uuid={uuid} edge={edge} key={uuid} />)}
        </g>
      </Origin>
    </Svg>
  );
};

export default Edges;