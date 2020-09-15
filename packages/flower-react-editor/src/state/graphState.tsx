import { atom, atomFamily } from "recoil";
import { Subject } from "rxjs";

export enum GraphStateKeys {
  GraphState = 'GRAPH_STATE',
  Events = 'GRAPH_EVENTS_OBSERVABLE',
};

export enum GraphEvents {
  NodeDrag = 'NODE_DRAG',
};

export type GraphEvent = {
  key: GraphEvents,
  payload?: any,
  time?: number
};

export const graphState = atomFamily({
  key: GraphStateKeys.GraphState,
  default: {
  }
});

export const graphEvents$ = atomFamily({
  key: `${GraphStateKeys.Events}`,
  default: new Subject<GraphEvent>()
});