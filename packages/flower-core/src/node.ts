import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from "rxjs";
import {
  distinct,
  filter,
  map,
  mergeAll,
  scan,
  shareReplay,
  startWith,
  takeUntil,
} from "rxjs/operators";
import { v4 as uuidv4 } from 'uuid';
import {
  ActivationFn,
  ConnectSubject,
  INodeImpl,
  NodeOutputs,
  SideEffectsFn,
} from "@plexius/flower-interfaces";

export enum Lifecycle {
  Created,
  Destroyed,
}

export default class Node<T = any> {
  public readonly uuid: string;
  private lifecycle$: Subject<Lifecycle> = new Subject();
  private connectObservable$: ConnectSubject = new Subject();
  private activationSubscription: Subscription = null;
  private inputs$: Observable<Map<string, any>> = null;
  private state$: BehaviorSubject<T> = null;
  private outputs: NodeOutputs = new Map();
  private activationFunction: ActivationFn<T> = () => Promise.resolve(new Map());
  private sideEffectsFunction: SideEffectsFn<T> = () => {};
  readonly type: string;

  constructor(readonly nodeImpl: INodeImpl<T>) {
    this.uuid = uuidv4();
    this.type = nodeImpl.type;
    nodeImpl.activationFunction &&
      this.setActivationFunction(nodeImpl.activationFunction);
    nodeImpl.sideEffectsFunction &&
      this.setSideEffectsFunction(nodeImpl.sideEffectsFunction);
    this.initializeState(nodeImpl.initialState);
    this.bindConnectToInputs();
    this.createOutputs();
    this.subscribeActivationObserver();
  }

  public getOutputObservable(propertyName: string) {
    if (!this.outputs.has(propertyName)) { return null; }
    return this.outputs.get(propertyName).asObservable();
  }

  public connectObservableToInput(
    observable: Observable<any>,
    propertyName: string,
  ) {
    if (
      this.nodeImpl.inputs &&
      Object.keys(this.nodeImpl.inputs).indexOf(propertyName) >= 0
    ) {
      this.connectObservable$.next({
        observable,
        propertyName,
      });
    }
  }

  public setState(newState: T): Observable<T> {
    if (typeof newState === "object") {
      this.state$.next({ ...newState });
    } else {
      this.state$.next(newState);
    }
    return this.state$.asObservable();
  }

  public getState$() {
    return this.state$.asObservable();
  }

  public patchState(newState: any): Node<T> {
    this.setState({ ...this.state$.getValue(), ...newState });
    return this;
  }

  private setActivationFunction(activationFunction: ActivationFn) {
    this.activationFunction = activationFunction.bind(this);
  }

  public setSideEffectsFunction(sideEffectsFunction: SideEffectsFn) {
    this.sideEffectsFunction = sideEffectsFunction.bind(this);
  }

  private initializeState(initialState: T) {
    this.state$ = initialState ? new BehaviorSubject<T>(initialState) : new BehaviorSubject<T>(null);
  }

  private subscribeActivationObserver() {
    const { lifecycle$, activationFunction } = this;
    this.activationSubscription = combineLatest(
      this.inputs$,
      this.state$.asObservable(),
      (inputs, state) => {
        return { inputs, state };
      },
    )
      .pipe(
        map((props) => {
          this.sideEffectsFunction({
            ...props,
            patchState: this.patchState.bind(this),
            setState: this.setState.bind(this)
          });
          return activationFunction(props.inputs, props.state);
        }),
        takeUntil(lifecycle$.pipe(filter((e) => e === Lifecycle.Destroyed))),
      )
      .subscribe((outputs) => {
        try {
          outputs.then(response=>{
            this.setOutputValues(response);
          })
          .catch(error=>{
            console.error(error);
          });
        }catch (error) {
          console.error(error);
        }
      });
  }

  private setOutputValues(newOutputs: Map<string, any>) {
    for (const [key, value] of newOutputs) {
      if (this.outputs.has(key)) {
        this.outputs.get(key).next(value);
      }
    }
  }

  private bindConnectToInputs() {
    this.inputs$ = this.connectObservable$.asObservable().pipe(
      map((connection) => {
        return connection.observable.pipe(
          map((value) => [connection.propertyName, value]),
        );
      }),
      distinct(),
      mergeAll(),
      scan(
        (inputsMap: Map<string, any>, input: [string, any]) =>
          new Map([...inputsMap, input]),
        new Map(),
      ),
      startWith(new Map()),
      shareReplay(),
    );
  }

  private createOutputs() {
    const { outputs } = this;
    this.nodeImpl.outputs &&
      Object.keys(this.nodeImpl.outputs).forEach((key) => {
        outputs.set(key, new BehaviorSubject<any>(null));
      });
  }
}
