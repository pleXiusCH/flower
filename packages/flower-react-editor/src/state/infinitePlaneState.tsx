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

export type TransformationDescriptor = {
  x?: number,
  y?: number,
  zoom?: number,
  delta?: boolean,
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

export const infinitePlaneOrignPosition = atom<ICenterPoint>({
  key: StateKeys.OriginPosition,
  default: null,
});

export const infintePlaneTransformation = selector<TransformationDescriptor>({
  key: StateKeys.TransformationState,
  get: ({get}: {get: Function}) => ({
    x: get(infinitePlaneXTranslation), 
    y: get(infinitePlaneYTranslation),
    zoom: get(infinitePlaneZoom)
  }),
  set: (accessor, transform: TransformationDescriptor) => {
    transform.x && updateTransformationAtom(accessor, infinitePlaneXTranslation, transform.x, transform.delta);
    transform.y && updateTransformationAtom(accessor, infinitePlaneYTranslation, transform.y, transform.delta);
    transform.zoom && updateTransformationAtom(accessor, infinitePlaneZoom, transform.zoom, transform.delta);
  }
});

export const infintePlaneTransformationMatrix = selector<string>({
  key: StateKeys.TransformationMatrx,
  get: ({get}) => `matrix(${get(infinitePlaneZoom)}, 0, 0, ${get(infinitePlaneZoom)}, ${get(infinitePlaneXTranslation)}, ${get(infinitePlaneYTranslation)})`,
});

const updateTransformationAtom = ({get, set}: {get: Function, set: Function}, atom: any, value: number, delta: boolean = false) => {
  const currentValue = get(atom);
  const updatedValue = delta ? currentValue + value : value;
  if (updatedValue !== currentValue) {
    set(atom, updatedValue);
  }
};