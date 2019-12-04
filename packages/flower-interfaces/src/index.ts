import { BehaviorSubject, Observable, Observer, Subject } from "rxjs";

export interface IPortSpec { 
  [p: string]: { 
    label: string, 
    type: string 
  }; 
};

export interface INodeImpl<T = any> {
  type: string;
  activationFunction?: ActivationFn<T>;
  sideEffectsFunction?: SideEffectsFn<T>;
  inputs?: IPortSpec
  outputs?: IPortSpec;
  initialState?: T;
}

export interface IPortDescriptor {
  nodeId: string;
  propertyName: string;
}

export interface IActivationProps<T = any> {
  inputs: Map<string, any>;
  state: T;
}

export type ActivationFn<T = any> = (
  inputs: Map<string, any>,
  state: T,
) => Map<string, any>;

export type SideEffectsFn<T = any> = (props?: {
  inputs: Map<string, any>;
  state: T;
  setState?: (newState: T) => void;
  patchState?: (state: {}) => void;
}) => void;

export type ConnectSubject = Subject<{
  observable: Observable<any>;
  propertyName: string;
}>;

export type ActivationObserver<T = any> = Observer<IActivationProps<T>>;

export type NodeOutputs = Map<string, BehaviorSubject<any>>;
