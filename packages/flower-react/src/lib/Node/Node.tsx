import styles from './Node.module.scss';

import { createElement, DOMElement, memo, useEffect, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { NodeImplementation, NodeInterface, PortDefinition } from '@flower/interfaces';

/* eslint-disable-next-line */
export interface NodeProps<S = unknown> {
  data: {
    nodeImplementation: NodeImplementation<S>
  },
  isConnectable: boolean,
}

export type PortProps = PortDefinition & {
  id: string
  ptype: "target" | "source"
  position: Position.Left | Position.Right
  isConnectable: boolean,
  label: string
}

const Port = (props: PortProps) => {
  let className = ""

  switch (props.position) {
    case Position.Left:
      className = styles['portLeft']
      break;
    case Position.Right:
      className = styles['portRight']
      break;
    default:
      break;
  }
  return (
    <div className={className}>
      <Handle
        id={props.id}
        type={props.ptype}
        position={props.position}
        isConnectable={props.isConnectable}
      />
      <div className={styles['portLabel']}>{props.label}</div>
    </div>
  );
}

const registerNodeInterface = (nodeInterface: NodeInterface) => {
  const registeredNodeInterface = window.customElements.get(nodeInterface.tag)
  if (!registeredNodeInterface) {
    window.customElements.define(nodeInterface.tag, nodeInterface.customElement);
  }
}

const Node = memo<NodeProps>(({ data, isConnectable }) => {

  const [nodeInterface, updateNodeInterface] = useState<DOMElement<any, any>>(createElement("span"));

  useEffect(() => {
    console.log("Node Interface init: ", data.nodeImplementation.interface);
    if (data?.nodeImplementation?.interface) {
      registerNodeInterface(data.nodeImplementation.interface);
      const element = createElement(data.nodeImplementation.interface.tag);
      updateNodeInterface(element);
    }
  }, [])

  console.log("Node data:", data);
  const name = data.nodeImplementation.name;
  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <span>{name}</span>
      </div>
      <div className={styles['content']}>
        <div className={styles['portWrapper']}>
          {data.nodeImplementation.inputs?.map(port => (
            <Port
              key={port.name}
              id={port.name}
              label={port.name}
              ptype="target"
              position={Position.Left}
              isConnectable
              {...port}
            />
          ))}
        </div>
        <div className={styles['interface']}>
          {nodeInterface}
        </div>
        <div className={styles['portWrapper']}>
          {data.nodeImplementation.outputs?.map(port => (
            <Port
              key={port.name}
              id={port.name}
              label={port.name}
              ptype="source"
              position={Position.Right}
              isConnectable
              {...port}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Node;
