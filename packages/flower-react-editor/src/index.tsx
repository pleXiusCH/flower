import { INodeImpl } from "@plexius/flower-interfaces";
import Graph from "@plexius/flower-core";
import React, { useState, useCallback } from "react";
import Nodes from './components/Nodes';
import { ControllerProvider } from './controller/ControllerContext';
import Edges from "./components/Edges";
import styled, { createGlobalStyle } from "styled-components";

export interface IEditorProps {
  implementations: INodeImpl[]
};

type ContainerStyleProps = {
  bgColor: string,
  dotColor: string,
  dotSize: number,
  dotSpace: number
};

const containerStyleProps: ContainerStyleProps = {
  bgColor: '#202b3c',
  dotColor: 'rgba(29, 35, 48, 0.85)',
  dotSize: 2,
  dotSpace: 22
};

const Container = styled.div<ContainerStyleProps>`
  @import url('https://fonts.googleapis.com/css?family=Ubuntu&display=swap');
  font-family: 'Ubuntu', sans-serif;
  height: 100vh;
  background:
		linear-gradient(90deg, ${p => p.bgColor} ${p => p.dotSpace - p.dotSize}px, transparent 1%) center,
		linear-gradient(${p => p.bgColor} ${p => p.dotSpace - p.dotSize}px, transparent 1%) center,
		${p => p.dotColor};
  background-size: ${p => p.dotSpace}px ${p => p.dotSpace}px;
`;

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #app {
    height: 100%;
  }
`

const Editor: React.SFC<IEditorProps> = (props) => {

  const [graph, setGraph] = useState(new Graph());

  const addNode = useCallback((nodeType: string) => {
    const impl: INodeImpl = props.implementations.find((impl) => impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, props.implementations]);

  return (
    <Container {...containerStyleProps}>
      <GlobalStyle />
      <ControllerProvider graph={graph}>
        {props.implementations.map((implementation, index) => {
          return (
          <button key={index} onClick={() => addNode(implementation.type)}>Add {implementation.type}</button>
          );
        })}
        <Nodes nodes$={graph.getNodes$()} />
        <Edges edges$={graph.getEdges$()} />
      </ControllerProvider>
    </Container>
  );
};

export default Editor;
