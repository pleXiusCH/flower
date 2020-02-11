import { IPortDescriptor } from "@plexius/flower-interfaces";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import uuidv4 from "uuid/v4";
import Graph from "./graph";
export enum EdgeEvent {
  ApplyModifier,
  Reconnect,
}

export default class Edge<T = any> {
  public sourcePortDescriptor: IPortDescriptor;
  public destinationPortDescriptor: IPortDescriptor;
  public readonly uuid: string;
  private parentGraph: Graph;
  private dataSource$: Observable<T>;
  private data$: Observable<T>;
  private events$: Subject<EdgeEvent> = new Subject();

  constructor(graph: Graph, from: IPortDescriptor, to: IPortDescriptor) {
    this.uuid = uuidv4();
    this.parentGraph = graph;
    this.sourcePortDescriptor = from;
    this.destinationPortDescriptor = to;
    this.bindSourceObservable(from);
    this.bindDataObservable(to);
  }

  public useModifier(modifier: OperatorFunction<T, T>) {
    const { events$ } = this;
    events$.next(EdgeEvent.ApplyModifier);
    this.data$ = this.dataSource$.pipe(
      modifier,
      takeUntil(events$.pipe(filter((e) => e === EdgeEvent.ApplyModifier))),
    );
    this.bindDataObservable(this.destinationPortDescriptor);
  }

  private bindSourceObservable(from: IPortDescriptor) {
    const { events$ } = this;
    if (from.nodeId && from.name) {
      this.dataSource$ = this.parentGraph
        .getNode(from.nodeId)
        .getOutputObservable(from.name);
      this.data$ = this.dataSource$.pipe(
        takeUntil(events$.pipe(filter((e) => e === EdgeEvent.ApplyModifier))),
      );
    }
  }

  private bindDataObservable(to: IPortDescriptor) {
    if (to.nodeId && to.name) {
      this.parentGraph
        .getNode(to.nodeId)
        .connectObservableToInput(this.data$, to.name);
    }
  }
}
