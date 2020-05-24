import { INodeImpl } from "@plexius/flower-interfaces";
import React from "react";
import { MosaicEditor } from "./components/MosaicEditor";
import styled, { createGlobalStyle } from "styled-components";
import { RecoilRoot } from 'recoil';

export interface IEditorProps {
  implementations: INodeImpl[]
};

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overscroll-behavior: none;
  }
  #app {
    height: 100%;
  }
`

const Editor: React.SFC<IEditorProps> = (props) => {

  return (
    <RecoilRoot>
        <GlobalStyle />
        <MosaicEditor implementations={props.implementations} />
    </RecoilRoot>
  );
};

export default Editor;
