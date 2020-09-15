import { atom, RecoilState, selectorFamily, atomFamily } from "recoil";
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

export const infinitePlaneXTranslation = atomFamily<number, string>({
  key: StateKeys.XTranslation,
  default: 0
});

export const infinitePlaneYTranslation = atomFamily<number, string>({
  key: StateKeys.YTranslation,
  default: 0
});

export const infinitePlaneZoom = atomFamily<number, string>({
  key: StateKeys.Zoom,
  default: 1
});

export const infinitePlaneOrignPosition = atomFamily<ICenterPoint, string>({
  key: StateKeys.OriginPosition,
  default: null,
});

export const infintePlaneTransformation: (infinitePlaneId: string) => RecoilState<TransformationDescriptor> = selectorFamily<TransformationDescriptor, string>({
  key: StateKeys.TransformationState,
  get: infinitePlaneId => ({get}) => ({
    x: get(infinitePlaneXTranslation(infinitePlaneId)),
    y: get(infinitePlaneYTranslation(infinitePlaneId)),
    zoom: get(infinitePlaneZoom(infinitePlaneId))
  }),
  set: infinitePlaneId => ({get, set}, newTransformation: TransformationDescriptor) => {
    if (newTransformation.x) updateTransformationAtom({get, set}, infinitePlaneXTranslation(infinitePlaneId), newTransformation.x, newTransformation.delta);
    if (newTransformation.y) updateTransformationAtom({get, set}, infinitePlaneYTranslation(infinitePlaneId), newTransformation.y, newTransformation.delta);
    if (newTransformation.zoom) updateTransformationAtom({get, set}, infinitePlaneZoom(infinitePlaneId), newTransformation.zoom, newTransformation.delta);
  }
});

export const infintePlaneTransformationMatrix: (infinitePlaneId: string) => RecoilState<string> = selectorFamily<string, string>({
  key: StateKeys.TransformationMatrx,
  get: infinitePlaneId => ({get}) => {
    const transformation = get(infintePlaneTransformation(infinitePlaneId));
    return `matrix(${transformation.zoom}, 0, 0, ${transformation.zoom}, ${transformation.x}, ${transformation.y})`;
  },
  set: infinitePlaneId => ({set}, newTransformation: TransformationDescriptor) => {
    set(infintePlaneTransformation(infinitePlaneId), newTransformation);
  }
});

const updateTransformationAtom = ({get, set}: {get: Function, set: Function}, _atom: RecoilState<number>, value: number, delta: boolean = false) => {
  const currentValue = get(_atom);
  const updatedValue = delta ? currentValue + value : value;
  if (updatedValue !== currentValue) {
    set(atom, updatedValue);
  }
};