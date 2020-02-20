import { Node as FlowerNode } from "@plexius/flower-core";
import { Observable } from "rxjs";
import { useObservable } from "react-use";
import React from "react";
import Node from "./Node";

export interface NodeProps {
  nodes$: Observable<Map<string, FlowerNode>>
}

const Nodes: React.SFC<NodeProps> = (props: NodeProps) => {
  const nodes = useObservable<Map<string, FlowerNode>>(props.nodes$, new Map());
  return (
    <>
      {[...nodes].map(([uuid, node]) => <Node uuid={uuid} node={node} key={uuid} />)}
    </>
  );

  
};

export default Nodes;