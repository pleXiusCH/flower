import React, { useCallback, useState, Fragment } from 'react';
import Nodes from './Nodes';
import Edges from './Edges';
import Graph from '@plexius/flower-core';
import { INodeImpl } from '@plexius/flower-interfaces';
import { useRecoilValue } from 'recoil';
import { implementations } from './../state/editorState'; 
import InfinitePlane from './InfinitePlane';
import SelectionHandler from './SelectionHandler';

const GraphView = (props: { graph: Graph; implementations: INodeImpl[]}) => {

  const [ graph, setGraph ] = useState(new Graph());
  const implementationsState: INodeImpl[] = useRecoilValue(implementations);

  const addNode = useCallback((nodeType: string) => {
    const impl: INodeImpl = implementationsState.find((impl) => impl.type === nodeType);
    graph.createNode(impl);
  }, [graph, implementationsState]);
  
  return (
    <Fragment>
      {implementationsState.map((implementation, index) => {
        return (
        <button key={index} onClick={() => addNode(implementation.type)}>Add {implementation.type}</button>
        );
      })}
      <SelectionHandler graph={graph} />
      <InfinitePlane>
        <Nodes nodes$={graph.getNodes$()} />
        <Edges edges$={graph.getEdges$()} />
      </InfinitePlane>
    </Fragment>
  );
};

export default GraphView;