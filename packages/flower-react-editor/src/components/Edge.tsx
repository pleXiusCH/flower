import React, { FC, useEffect } from "react";
import { Edge as FlowerEdge } from "@plexius/flower-core";
import { usePortStatus } from "../hooks/PortHooks";
import { useUpdate } from "react-use";
import { useController, Ctl } from "../controller/ControllerContext";
import ConnectionsController from "../controller/ConnectionsController";

export interface IEdgeProps {
  uuid: string;
  edge: FlowerEdge
};

export interface ICenterPoint {
  x: number;
  y: number;
}

const getCenterPoint = (domRect: DOMRect): ICenterPoint => {
  if (!domRect) return { x: null, y: null};
  const x = domRect.x + domRect.width / 2;
  const y = domRect.y + domRect.height / 2;
  return { x, y };
}

const getPathString = (start: ICenterPoint, end: ICenterPoint) => {
  const dist = Math.sqrt(Math.pow((end.x - start.x), 2) + Math.pow((end.y - start.y), 2));
  return `M${start.x},${start.y} C${start.x + dist * 0.25},${start.y} ${end.x - dist * 0.25},${end.y}  ${end.x},${end.y}`;
}

const Edge: FC<IEdgeProps> = (props) => {
  const update = useUpdate();
  const connectionsController = useController(Ctl.Connections) as ConnectionsController;
  const outputPort = usePortStatus(props.edge.sourcePortDescriptor);
  const inputPort = usePortStatus(props.edge.destinationPortDescriptor);
  const inputPos: ICenterPoint = getCenterPoint(inputPort?.ref?.getBoundingClientRect());
  const outputPos: ICenterPoint = getCenterPoint(outputPort?.ref?.getBoundingClientRect());
  const pathString = getPathString(outputPos, inputPos);

  useEffect(() => {
    connectionsController.setEdgeUpdateFunction(props.uuid, update);
  }, [update]);

  // return (
  //   <>
  //     <path stroke="#808080" fill="transparent" strokeWidth="3" d={pathString} />
  //     <text x={inputPos.x+((outputPos.x - inputPos.x)/2)} y={inputPos.y+((outputPos.y - inputPos.y)/2)}>{typeof props.connection.data === 'object' ? '{OBJ}' : props.connection.data}</text>
  //   </>
  // )

  return (
    <>
      <path stroke="#151a24" fill="transparent" strokeWidth="4" d={pathString} />
    </>
  )
};

export default Edge;