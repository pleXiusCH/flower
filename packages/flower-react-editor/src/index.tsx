import { INodeImpl } from "@plexius/flower-interfaces";
import Graph from "@plexius/flower-core";
import React, { useState, useCallback, useEffect } from "react";
import Nodes from './components/Nodes';

export interface IEditorProps {
  implementations: INodeImpl[]
};

const Editor: React.SFC<IEditorProps> = (props) => {

  const [graph, setGraph]: [Graph, React.Dispatch<Graph>] = useState(new Graph());

  const addNode = useCallback((nodeType: string) => {
    const impl: INodeImpl = props.implementations.find((impl) => impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, props.implementations]);

  return (
    <div>
      {props.implementations.map((implementation, index) => {
        return (
        <button key={index} onClick={() => addNode(implementation.type)}>Add {implementation.type}</button>
        );
      })}
      <Nodes nodes$={graph.getNodes$()} />
    </div>
  );
};

export default Editor;
