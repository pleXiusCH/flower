import { atom, selector, atomFamily, selectorFamily } from "recoil";
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

export const portStateById = atomFamily<PortStateInt, string>({
  key: PortsStateKeys.PortState,
  default: id => ({
    id,
    descriptor: null,
  })
});

export const selectedPortIds = atom<string[]>({
  key: PortsStateKeys.SelectedPortIds,
  default: [],
});

export const activePortIds = atom<string[]>({
  key: PortsStateKeys.ActivePortIds,
  default: [],
});

export const portIsSelectedById = selectorFamily<boolean, string>({
  key: PortsStateKeys.PortIsSelectedById,
  get: portId => ({get}) => get(selectedPortIds).includes(portId),
  set: portId => ({set, get}, isSelected: boolean) => {
    const _selectedPortIds = get(selectedPortIds);
    if (isSelected && !_selectedPortIds.includes(portId)) {
      set(selectedPortIds, [..._selectedPortIds, portId]);
    } else if (!isSelected && _selectedPortIds.includes(portId)) {
      set(selectedPortIds, _selectedPortIds.filter(id => id !== portId));
    }
  },
});

export const selectedPorts = selector({
  key: PortsStateKeys.SelectedPorts,
  get: ({get}) => {
    return get(selectedPortIds).map((id: string) => get(portStateById(id)));
  },
});

export const portCenterPoint = atomFamily<ICenterPoint, string>({
  key: PortsStateKeys.PortCenterPoint,
  default: null
});

export const portsBoundingBox = (...ids: string[]) => {
  const combinedId = ids.sort().reduce((acc, id) => `${acc}_${id}`);
  return selector({
    key: `${PortsStateKeys.PortsBoundingBox}#${combinedId}`,
    get: ({get}) => {
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