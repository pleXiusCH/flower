import styles from './ChatbotNode.module.scss';

import { createElement, memo, useEffect, useState } from 'react';
import { Position } from 'react-flow-renderer';
import { NodeImplementation, NodeInterface } from '@flower/interfaces';
import { renderPorts } from '../Port/Port';

/* eslint-disable-next-line */
export interface NodeProps<S = {}> {
  data: {
    threadName: string,
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

export const ChatbotNode = memo<NodeProps>(({ data, isConnectable }) => {
  const [nodeInterfaceTag, setNodeInterfaceTag] = useState("span");

  useEffect(() => {
    console.log("Node Interface init: ", data.nodeImplementation.interface);
    if (data?.nodeImplementation?.interface) {
      registerNodeInterface(data.nodeImplementation.interface);
      setNodeInterfaceTag(data.nodeImplementation.interface.tag);
    }
  }, [])

  const nodeImpl = data.nodeImplementation;
  const threadName = data.threadName;

  return (
    <div className={styles['container']}>
      <div className={styles['thread-name']}>{threadName}</div>
      <div className={styles['header']}>
        <div>{nodeImpl.name}</div>
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
          {createElement(nodeInterfaceTag, { ...nodeImpl.internalState })}
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

export default ChatbotNode;
