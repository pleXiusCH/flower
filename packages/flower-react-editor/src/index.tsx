import React from "react";
import { RecoilRoot } from 'recoil';
import "./style.less";
import { INodeImpl } from "@plexius/flower-interfaces";
import { MosaicEditor } from "./components/mosaic/MosaicEditor";

export interface IEditorProps {
  implementations: INodeImpl[]
};

const Editor: React.SFC<IEditorProps> = (props) => {
  return (
    <React.StrictMode>
      <RecoilRoot>
          <MosaicEditor implementations={props.implementations} />
      </RecoilRoot>
    </React.StrictMode> 
  );
};

export default Editor;
