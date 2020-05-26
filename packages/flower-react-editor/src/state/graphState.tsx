import { atom } from "recoil";
import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

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

export const graphState = (graphId: string) => atom({
  key: `${GraphStateKeys.GraphState}#${graphId}`,
  default: {
  }
});

export const graphEvents$ = atom({
  key: `${GraphStateKeys.Events}`,
  default: new Subject<GraphEvent>()/*.pipe(map(event => ({...event, time: Date.now()})))*/,
});