import React, {Fragment, useCallback, useState, useEffect} from 'react';
import Nodes from './Nodes';
import Edges from './Edges';
import { Flower } from '@plexius/flower-core';
import { INodeImpl } from '@plexius/flower-interfaces';
import { useRecoilValue } from 'recoil';
import { implementations } from './../state/editorState';
import SelectionHandler from './SelectionHandler';
import GraphPanel from "./GraphPanel";
import {Header} from "./atoms/Header";
import InfinitePlane from './InfinitePlane';


const GraphView = () => {
  const [flower] = useState(new Flower());
  const [graph] = useState(flower.addGraph());
  const implementationsState: INodeImpl[] = useRecoilValue(implementations);

  useEffect(() => {
    (window as any).flower = flower;
  }, [flower])

  const addNode = useCallback((nodeType: string) => {
    const impl: INodeImpl = implementationsState.find((_impl) => _impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, implementationsState]);

  return (

      <Fragment>
        <SelectionHandler graph={graph}/>
        <Header>
          <GraphPanel addNode={addNode}/>
        </Header>
        <Nodes graphId={graph.getUuid()} nodes$={graph.getNodes$()}/>
        <Edges graphId={graph.getUuid()} edges$={graph.getEdges$()}/>
      </Fragment>
  );
};

export default GraphView;