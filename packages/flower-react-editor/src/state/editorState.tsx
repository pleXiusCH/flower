import { atom, atomFamily } from "recoil";
import { Subject } from "rxjs";
import { INodeImpl } from "@plexius/flower-interfaces";

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
  }
});

export const mosaicViewState = atomFamily<any, number>({
  key: EditorStateKeys.MosaicViews,
  default: (id: number) => ({
    title: `Window #${id}`,
    selectedView: 'emptyView'
  })
});

export const implementations = atom<INodeImpl[]>({
  key: EditorStateKeys.Implementations,
  default: []
});

export const editorEvents$ = atom({
  key: EditorStateKeys.Events,
  default: new Subject<EditorEvents>(),
});