import { MosaicNode } from "react-mosaic-component/lib/types";
import { atom } from "recoil";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

export enum EditorStateKeys {
  MosaicState = 'EDITOR_MOSAIC_STATE',
  MosaicViews = 'EDITOR_MOSAIC_VIEWS',
  Implementations = 'EDITOR_IMPLEMENTATIONS',
  Events = 'EDITOR_EVENTS_OBSERVABLE'
};

export enum EditorEvents {
  RearrangeWindows = 'REARRANGE_WINDOWS',
};

export const mosaicState = atom({
  key: EditorStateKeys.MosaicState,
  default: {
    direction: 'row',
    first: 1,
    second: 2,
    splitPercentage: 20
  } as MosaicNode<number>
});

export const mosaicViews = (id: number) => atom({
  key: `${EditorStateKeys.MosaicViews}#${id}`,
  default: {
    title: `Window #${id}`,
    selectedView: 'emptyView'
  }
});

export const implementations = atom({
  key: EditorStateKeys.Implementations,
  default: []
});

export const editorEvents$ = atom({
  key: EditorStateKeys.Events,
  default: new Subject<EditorEvents>().pipe(map((event: EditorEvents) => ({event, time: Date.now()}))),
});