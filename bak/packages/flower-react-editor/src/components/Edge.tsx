import React, { FC, useEffect, useState } from "react";
import { Edge as FlowerEdge } from "@plexius/flower-core";
import { useRecoilValue } from 'recoil';
import { portCenterPoint } from './../state/portsState';

export interface IEdgeProps {
  uuid: string;
  edge: FlowerEdge
};

export interface ICenterPoint {
  x: number;
  y: number;
}

const getPathString = (start: ICenterPoint, end: ICenterPoint) => {
  const dist = Math.sqrt(Math.pow((end.x - start.x), 2) + Math.pow((end.y - start.y), 2));
  return `M${start.x},${start.y} C${start.x + dist * 0.25},${start.y} ${end.x - dist * 0.25},${end.y}  ${end.x},${end.y}`;
}

const Edge: FC<IEdgeProps> = (props) => {
  const inputPortId = `${props.edge.destinationPortDescriptor.nodeId}-${props.edge.destinationPortDescriptor.name}`;
  const outputPortId = `${props.edge.sourcePortDescriptor.nodeId}-${props.edge.sourcePortDescriptor.name}`;
  const outputPos: ICenterPoint = useRecoilValue(portCenterPoint(outputPortId));
  const inputPos: ICenterPoint = useRecoilValue(portCenterPoint(inputPortId));
  const [ pathString, setPathString ] = useState('');

  useEffect(() => {
    setPathString(getPathString(outputPos, inputPos));
  }, [inputPos, outputPos]);

  return (
    <>
      <path stroke="#151a24" fill="transparent" strokeWidth="4" d={pathString} />
    </>
  )
};

export default Edge;