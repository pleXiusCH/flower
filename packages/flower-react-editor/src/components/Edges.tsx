import React, { useEffect, useState, useRef } from "react";
import { Observable } from "rxjs";
import { Edge as FlowerEdge } from "@plexius/flower-core";
import { useObservable } from "react-use";
import styled from "styled-components";
import Edge from "./Edge";
import { editorEvents$, EditorEvents } from "../state/editorState";
import { useRecoilValue } from 'recoil';
import { filter } from "rxjs/operators";

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
  const [relativePosition, setRelativePosition] = useState({x: 0, y: 0});
  const svgRef = useRef<SVGSVGElement>(null);
  const editorEventReaarangeWindows = useObservable(useRecoilValue(editorEvents$)
    .pipe(filter<{event: String, time: number}>(({event}) => (event === EditorEvents.RearrangeWindows))));

  const calcRelativePosition = () => {
    if (svgRef && svgRef.current) {
      const {x, y} = svgRef.current.getBoundingClientRect();
      console.log("set new rel pos", x, y);
      setRelativePosition({x, y});
    }
  };

  useEffect(() => {
    calcRelativePosition();
  }, [svgRef, editorEventReaarangeWindows]);
  

  return (
    <Svg ref={svgRef}>
      <g style={{transform: `translate(${-relativePosition.x}px, ${-relativePosition.y}px)`}}>
        {[...edges].map(([uuid, edge]) => <Edge uuid={uuid} edge={edge} key={uuid} />)}
      </g>
    </Svg>
  );
};

export default Edges;