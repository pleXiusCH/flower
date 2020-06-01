import { atom, selector } from "recoil";
import { ICenterPoint } from "./portsState";

export enum StateKeys {
  XTranslation = 'INFINITE_PLANE_X_TRANSLATION',
  YTranslation = 'INFINITE_PLANE_Y_TRANSLATION',
  Zoom = 'INFINITE_PLANE_ZOOM',
  TransformationMatrx = "INFINITE_PLANE_TRANSFORMATION_MATRIX",
  OriginPosition = "INFINTE_PLANE_ORIGIN_POSITION",
  TransformationState = "INFINITE_PLANE_TRANSFORMATION_STATE",
};

export const infinitePlaneXTranslation = atom({
  key: StateKeys.XTranslation,
  default: 0
});

export const infinitePlaneYTranslation = atom({
  key: StateKeys.YTranslation,
  default: 0
});

export const infinitePlaneZoom = atom({
  key: StateKeys.Zoom,
  default: 1
});

export const infinitePlaneOrignPosition: () => ICenterPoint = atom({
  key: StateKeys.OriginPosition,
  default: null,
  persistence_UNSTABLE: {
    type: 'log'
  },
});

export const infintePlaneTransformation: () => TransformationDescriptor = selector({
  key: StateKeys.TransformationState,
  get: ({get}: {get: Function}) => ({
    x: get(infinitePlaneXTranslation), 
    y: get(infinitePlaneYTranslation),
    zoom: get(infinitePlaneZoom)
  }),
});

export type TransformationDescriptor = {
  x?: number,
  y?: number,
  zoom?: number,
  delta?: boolean,
};

export const infintePlaneTransformationMatrix = selector({
  key: StateKeys.TransformationMatrx,
  get: ({get}: {get: Function}) => `matrix(${get(infinitePlaneZoom)}, 0, 0, ${get(infinitePlaneZoom)}, ${get(infinitePlaneXTranslation)}, ${get(infinitePlaneYTranslation)})`,
  set: (accessor: {set: Function, get: Function}, transform: TransformationDescriptor) => {
    transform.x && updateTransformationAtom(accessor, infinitePlaneXTranslation, transform.x, transform.delta);
    transform.y && updateTransformationAtom(accessor, infinitePlaneYTranslation, transform.y, transform.delta);
    transform.zoom && updateTransformationAtom(accessor, infinitePlaneZoom, transform.zoom, transform.delta);
  }
});

const updateTransformationAtom = ({get, set}: {get: Function, set: Function}, atom: any, value: number, delta: boolean = false) => {
  const currentValue = get(atom);
  const updatedValue = delta ? currentValue + value : value;
  if (updatedValue !== currentValue) {
    set(atom, updatedValue);
  }
};