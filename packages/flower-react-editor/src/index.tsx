import { INodeImpl } from "@plexius/flower-interfaces";
import React from "react";
import { MosaicEditor } from "./components/MosaicEditor";
import styled, { createGlobalStyle } from "styled-components";
import { RecoilRoot } from 'recoil';

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

  return (
    <RecoilRoot>
      <Container {...containerStyleProps}>
        <GlobalStyle />
        <MosaicEditor implementations={props.implementations} />
      </Container>
    </RecoilRoot>
  );
};

export default Editor;
