import React, {Fragment, useCallback, useEffect, useState} from 'react';
import Nodes from './Nodes';
import Edges from './Edges';
import Flower, { Graph } from '@plexius/flower-core';
import { INodeImpl } from '@plexius/flower-interfaces';
import { useRecoilValue } from 'recoil';
import { implementations } from './../state/editorState'; 
import SelectionHandler from './SelectionHandler';
import GraphPanel from "./GraphPanel";
import {Header} from "./atoms/Header";


const GraphView = () => {

  const [flower] = useState(new Flower());
  const [graph, setGraph] = useState<Graph>(null);
  const implementationsState = useRecoilValue<INodeImpl[]>(implementations);

  useEffect(() => {
    setGraph(flower.addGraph());
  }, []);

  const addNode = useCallback((nodeType: string) => {
    const impl = implementationsState.find((impl) => impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, implementationsState]);

  return (

      <Fragment>
        <SelectionHandler graph={graph}/>
        <Header>
          <GraphPanel addNode={addNode}/>
        </Header>
        { graph &&
        <Fragment>
          <Nodes nodes$={graph.getNodes$()}/>
          <Edges edges$={graph.getEdges$()}/>
        </Fragment>
        }
      </Fragment>
  );
};

export default GraphView;