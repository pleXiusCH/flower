import { INodeImpl } from "@plexius/flower-interfaces";
import { AdditionImpl, EmitNumberImpl, TapImpl } from "@plexius/flower-nodes";
import FlowerEditor from "@plexius/flower-react-editor";
import React from "react";
import ReactDOM from "react-dom";

const implementations: INodeImpl[] = [ AdditionImpl, EmitNumberImpl, TapImpl ];

ReactDOM.render(
  <FlowerEditor implementations={implementations} />,
  document.getElementById("app"),
);