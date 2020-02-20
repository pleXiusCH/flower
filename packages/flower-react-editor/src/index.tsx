import { INodeImpl } from "@plexius/flower-interfaces";
import Graph from "@plexius/flower-core";
import React, { useState, useCallback } from "react";
import Nodes from './components/Nodes';
import { ControllerProvider } from './controller/ControllerContext';
import Edges from "./components/Edges";

export interface IEditorProps {
  implementations: INodeImpl[]
};

const Editor: React.SFC<IEditorProps> = (props) => {

  const [graph, setGraph] = useState(new Graph());

  const addNode = useCallback((nodeType: string) => {
    const impl: INodeImpl = props.implementations.find((impl) => impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, props.implementations]);

  return (
    <div className="editor-container">
      <ControllerProvider graph={graph}>
        {props.implementations.map((implementation, index) => {
          return (
          <button key={index} onClick={() => addNode(implementation.type)}>Add {implementation.type}</button>
          );
        })}
        <Nodes nodes$={graph.getNodes$()} />
        <Edges edges$={graph.getEdges$()} />
      </ControllerProvider>
    </div>
  );
};

export default Editor;
