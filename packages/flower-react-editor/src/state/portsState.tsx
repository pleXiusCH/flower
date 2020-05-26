import { atom, selector } from "recoil";
import { IPortDescriptor } from "@plexius/flower-interfaces";

export enum PortsStateKeys {
  PortState = 'PORT_STATE',
  SelectedPortIds = 'SELECTED_PORT_IDS',
  SelectedPorts = 'SELECTED_PORTS_SELECTOR',
  ActivePortIds = 'ACTIVE_PORT_IDS',
  DerrivedPortState = 'DERRIVED_PORT_STATE_SELECTOR',
  PortCenterPoint = 'PORT_CENTER_POINT',
  PortsBoundingBox = 'PORTS_BOUNDING_BOX_SELECTOR',
  PortIdsByNodeId = 'PORT_IDS_BY_NODE_ID',
  PortIsSelectedById = 'PORT_IS_SELECTED_BY_ID'
};

export interface PortStateInt {
  id: string,
  descriptor: IPortDescriptor,
  connectionId?: string
};

export const portStateById = (id: string) => atom({
  key: `${PortsStateKeys.PortState}#${id}`,
  default: {
    id: id,
    descriptor: null,
    ref: null,
  } as PortStateInt
});

export const selectedPortIds = atom({
  key: PortsStateKeys.SelectedPortIds,
  default: [],
});

export const activePortIds = atom({
  key: PortsStateKeys.ActivePortIds,
  default: [],
});

export const portIsSelectedById = (portId: string) => selector({
  key: `${PortsStateKeys.PortIsSelectedById}#${portId}`,
  get: ({get}: {get: Function}) => get(selectedPortIds).includes(portId),
  set: ({set, get}: {set: Function, get: Function}, isSelected: boolean) => {
    const _selectedPortIds: string[] = get(selectedPortIds);
    isSelected && !_selectedPortIds.includes(portId) && set(selectedPortIds, [..._selectedPortIds, portId]);
    !isSelected && _selectedPortIds.includes(portId) && set(selectedPortIds, _selectedPortIds.filter(id => id !== portId));
  },
});

export const selectedPorts = selector({
  key: PortsStateKeys.SelectedPorts,
  get: ({get}: {get: Function}) => {
    const selectedIds = get(selectedPortIds);
    return selectedIds.map((id: string) => get(portStateById(id)));
  },
});

export const portCenterPoint = (id: string) => atom({
  key: `${PortsStateKeys.PortCenterPoint}#${id}`,
  default: null
});

export const portsBoundingBox = (...ids: string[]) => {
  const combinedId = ids.sort().reduce((acc, id) => `${acc}_${id}`);
  return selector({
    key: `${PortsStateKeys.PortsBoundingBox}#${combinedId}`,
    get: ({get}: {get: Function}) => {
      const centerPoints: ICenterPoint[] = ids.map(id => get(portCenterPoint(id)));
      return computeWrappingBoundingBox(centerPoints);
    },
  })
};

const computeWrappingBoundingBox = (points: ICenterPoint[]) => {
  let x: number = null;
  let y: number = null;
  let width: number = 0;
  let height: number = 0;

  points.forEach(point => {
    (!x || point.x < x) && (x = point.x);
    (!y || point.y < y) && (y = point.y);
    (width < point.x - x) && (width = point.x - x);
    (height < point.y - y) && (height = point.y - y)
  });
  return new DOMRect(x,y,width,height);
};

export interface ICenterPoint {
  x: number;
  y: number;
}

export const computeCenterPoint = (domRect: DOMRect): ICenterPoint => {
  if (!domRect) return { x: null, y: null};
  const x = domRect.x + domRect.width / 2;
  const y = domRect.y + domRect.height / 2;
  return { x, y };
}