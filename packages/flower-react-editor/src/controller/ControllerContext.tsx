import React, { useContext, FC } from 'react';
import ConnectionsController from './ConnectionsController';
import Graph from '@plexius/flower-core/src';
import ControllerInt from './ControllerInt';

export enum Ctl {
  Connections = 'connections'
}

const getControllerMap = (graph: Graph) => {
  return new Map<Ctl, ControllerInt>([
    [Ctl.Connections, ConnectionsController.getInstance().setGraph(graph)]
  ])
};

const Context = React.createContext<Map<string, ControllerInt>>(new Map());

export const ControllerProvider: FC<{ graph: Graph }> = ({ graph, children }) => (<Context.Provider value={getControllerMap(graph)}>{children}</Context.Provider>);

export function useController(name: Ctl): ControllerInt {
  return useContext(Context).get(name);
}