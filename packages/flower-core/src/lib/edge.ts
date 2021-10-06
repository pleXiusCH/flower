import { IPortDescriptor } from "@plexius/flower-interfaces/src";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { v4 as uuidv4 } from 'uuid';
import Graph from "./graph";
import ActivitiesListener$ from "./activitiesListener";
export enum EdgeEvent {
  ApplyModifier,
  Reconnect,
}

export default class Edge<T = any> extends ActivitiesListener$ {
  public sourcePortDescriptor: IPortDescriptor;
  public destinationPortDescriptor: IPortDescriptor;
  public readonly uuid: string;
  private parentGraph: Graph;
  private dataSource$: Observable<T>;
  private data$: Observable<T>;
  private events$: Subject<EdgeEvent> = new Subject();
  private modifier: OperatorFunction<T, T>;

  constructor(graph: Graph, from: IPortDescriptor, to: IPortDescriptor) {
    super();
    this.uuid = uuidv4();
    this.parentGraph = graph;
    this.sourcePortDescriptor = from;
    this.destinationPortDescriptor = to;
    this.bindSourceObservable(from);
    this.bindDataObservable(to);
    this.addActivity(`events::${this.uuid}`, this.events$.asObservable());
  }

  public useModifier(modifier: OperatorFunction<T, T>) {
    const { events$ } = this;
    events$.next(EdgeEvent.ApplyModifier);
    this.modifier = modifier;
    this.data$ = this.dataSource$.pipe(
      this.modifier,
      takeUntil(events$.pipe(filter((e) => e === EdgeEvent.ApplyModifier))),
    );
    this.bindDataObservable(this.destinationPortDescriptor);
  }

  public getModifier() {
    return this.modifier;
  }

  private bindSourceObservable(from: IPortDescriptor) {
    const { events$ } = this;
    if (from.nodeId && from.name) {
      this.dataSource$ = this.parentGraph
        .getNode(from.nodeId)
        .getOutputObservable(from.name)!;
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
