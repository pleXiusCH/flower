import React, { FC, useState, useEffect } from "react";
import { IPortSpec, PortType, IPortDescriptor } from "@plexius/flower-interfaces/src";
import Port from "./Port";

export interface PortsProps {
  ports: IPortSpec,
  nodeId: string,
  type: PortType
}

const createPortDescriptor = (name: string, type: PortType, nodeId: string): IPortDescriptor => {
  return { nodeId, type, name }
}

export const Ports: FC<PortsProps> = (props) => {
  const [portDescriptors, setPortDescriptors] = useState<Set<IPortDescriptor>>(new Set());
  const {ports, type, nodeId} = props;

  useEffect(() => {
    setPortDescriptors(new Set(Object.entries(props.ports).map(([key]) => createPortDescriptor(key, type, nodeId))));
  }, [ports, type, nodeId]);
  
  return (
    <div>
      {[...portDescriptors].map((descriptor) => <Port {...ports[descriptor.name]} key={descriptor.name} descriptor={descriptor} />)}
    </div>
  );
};