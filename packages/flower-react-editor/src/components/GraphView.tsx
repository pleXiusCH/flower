import React, {Fragment, useCallback, useState} from 'react';
import Nodes from './Nodes';
import Edges from './Edges';
import Graph from '@plexius/flower-core';
import {INodeImpl} from '@plexius/flower-interfaces';
import {useRecoilValue} from 'recoil';
import {implementations} from './../state/editorState';
import InfinitePlane from './InfinitePlane';
import SelectionHandler from './SelectionHandler';
import GraphPanel from "./GraphPanel";
import {Header} from "./atoms/Header";


const GraphView = () => {

  const [graph] = useState(new Graph());
  const implementationsState: INodeImpl[] = useRecoilValue(implementations);

  const addNode = useCallback((nodeType: string) => {
    const impl: INodeImpl = implementationsState.find((impl) => impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, implementationsState]);

  return (

      <Fragment>
        <SelectionHandler graph={graph}/>
        <Header>
          <GraphPanel addNode={addNode}/>
        </Header>
        <InfinitePlane>
          <Nodes nodes$={graph.getNodes$()}/>
          <Edges edges$={graph.getEdges$()}/>
        </InfinitePlane>
      </Fragment>
  );
};

export default GraphView;