import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Mosaic, MosaicWindow, MosaicBranch, CreateNode, MosaicZeroState, MosaicNode } from 'react-mosaic-component';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { mosaicViews, mosaicState, implementations } from '../state/editorState';

import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { INodeImpl } from '@plexius/flower-interfaces';

const ViewMap: { [viewId: string]: any } = {
  emptyView: () => (<div>empty</div>),
  components: () => (<div>components view mock</div>),
  graphView: lazy(() => import('./GraphView'))
};

export const MosaicView = (props: {id: number, path: MosaicBranch[], onCreateNode: CreateNode<number>}) => {
  const [ viewState, setViewState ] = useRecoilState(mosaicViews(props.id));
  const SelectedView = ViewMap[viewState.selectedView];
  return (
    <MosaicWindow<number> path={props.path} createNode={props.onCreateNode} title={viewState.title}>
      <Suspense fallback={<div>Loading...</div>}>
        <SelectedView />
      </Suspense>
      <select name="viewSelection" id="viewSelection" value={viewState.selectedView} onChange={e => setViewState({...viewState, selectedView: e.target.value})}>
        <option value="emptyView">Empty view</option>
        <option value="components">Components view</option>
        <option value="graphView">Graph view</option>
      </select>
    </MosaicWindow>
  );
};

export const MosaicEditor = (props: { implementations: INodeImpl[] }) => {

  const [ mosaicStateValue, setMosaicState ] = useRecoilState(mosaicState);
  const [ mosaicViewCount, setMosaicViewCount ] = useState(2);
  const setImplementations = useSetRecoilState(implementations);

  useEffect(() => {
    setImplementations(props.implementations);
  }, [props.implementations]);

  const createNode = () => {
    setMosaicViewCount(mosaicViewCount + 1);
    return mosaicViewCount + 1;
  };

  const onChange = (currentMosaicState: MosaicNode<number> | null) => {
    setMosaicState(currentMosaicState)
  };

  return (
    <Mosaic<number>
      className="mosaic-blueprint-theme bp3-dark"
      renderTile={(id, path) => <MosaicView id={id} path={path} onCreateNode={createNode} />}
      value={mosaicStateValue}
      onChange={onChange}
      zeroStateView={<MosaicZeroState createNode={createNode} />}
    />);
};