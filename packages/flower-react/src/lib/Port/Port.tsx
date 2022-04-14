import { PortDefinition } from '@flower/interfaces';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Port.module.scss';

export type PortProps = PortDefinition & {
  id: string
  ptype: "target" | "source"
  position: Position.Left | Position.Right
  isConnectable: boolean,
  label: string
}

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