import { atom } from "recoil";
import { memo } from "react";

export enum EditorStateKeys {
  MosaicState = 'EDITOR_MOSAIC_STATE',
  MosaicViews = 'EDITOR_MOSAIC_VIEWS',
  Implementations = 'EDITOR_IMPLEMENTATIONS'
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