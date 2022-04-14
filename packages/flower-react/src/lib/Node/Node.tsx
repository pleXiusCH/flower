import styles from './Node.module.scss';

import { createElement, DOMElement, memo, ReactElement, useEffect, useState } from 'react';
import { Position } from 'react-flow-renderer';
import { NodeImplementation, NodeInterface } from '@flower/interfaces';
import { renderPorts } from '../Port/Port';

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

  const [nodeInterfaceTag, setNodeInterfaceTag] = useState("span");
  const [name, setName] = useState("Peter");

  useEffect(() => {
    console.log("Node Interface init: ", data.nodeImplementation.interface);
    if (data?.nodeImplementation?.interface) {
      registerNodeInterface(data.nodeImplementation.interface);
      setNodeInterfaceTag(data.nodeImplementation.interface.tag);
    }

    setTimeout(() => {
      console.log("Setting name to Parker");
      setName("Parker");
    }, 5000);
  }, [])

  console.log("Node data:", data);
  const nodeImpl = data.nodeImplementation;
  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <span>{nodeImpl.name}</span>
      </div>
      <div className={styles['content']}>
        <div className={styles['portWrapper']}>
          {nodeImpl.inputs && renderPorts(nodeImpl.inputs.map(portDefinition => ({
            ...portDefinition,
            ptype: "target",
            position: Position.Left,
            isConnectable
          })))}
        </div>
        <div className={styles['interface']}>
          {createElement(nodeInterfaceTag, { name })}
        </div>
        <div className={styles['portWrapper']}>
          {nodeImpl.outputs && renderPorts(nodeImpl.outputs.map(portDefinition => ({
            ...portDefinition,
            ptype: "source",
            position: Position.Right,
            isConnectable
          })))}
        </div>
      </div>
    </div>
  );
});

export default Node;
