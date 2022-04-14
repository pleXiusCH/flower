import styles from './Node.module.scss';

import { createElement, DOMElement, memo, useEffect, useState } from 'react';
import { Position } from 'react-flow-renderer';
import { NodeImplementation, NodeInterface } from '@flower/interfaces';
import { Port } from '../Port/Port';

/* eslint-disable-next-line */
export interface NodeProps<S = unknown> {
  data: {
    nodeImplementation: NodeImplementation<S>
  },
  isConnectable: boolean,
}

const registerNodeInterface = (nodeInterface: NodeInterface) => {
  const registeredNodeInterface = window.customElements.get(nodeInterface.tag)
  if (!registeredNodeInterface) {
    window.customElements.define(nodeInterface.tag, nodeInterface.customElement);
  }
}

export const Node = memo<NodeProps>(({ data, isConnectable }) => {

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
              key={port.id}
              label={port.label || port.id}
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
              key={port.id}
              label={port.label || port.id}
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
