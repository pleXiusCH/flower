import { PortDefinition } from '@flower/interfaces';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Port.module.scss';

export type PortType = "source" | "target";

export type PortProps = PortDefinition & {
  ptype: PortType
  position: Position
  isConnectable: boolean,
}

export const renderPorts = (ports: PortProps[]) => (
  ports.map(port => (
    <Port
      {...port}
      key={port.id}
      label={port.label || port.id}
    />
  ))
);

export const Port = (props: PortProps) => {
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

export default Port;