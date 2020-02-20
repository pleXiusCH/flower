import { IPortDescriptor, PortType } from "@plexius/flower-interfaces";
import ControllerInt from "./ControllerInt";
import Graph, { Edge } from "@plexius/flower-core/src";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { takeUntil, filter, distinctUntilChanged, map, mergeMap, distinct, scan } from "rxjs/operators";

export type PortStatus = {
  descriptor: IPortDescriptor,
  ref: HTMLElement,
  isSelected: boolean,
  isActive: boolean,
  connectionId?: string
};

export enum Events {
  SetGraph
};

export type PortSelections = {
  [t: string]: Set<IPortDescriptor>
}

export default class ConnectionsController implements ControllerInt<ConnectionsController> {

  private static instance: ConnectionsController;
  private currentGraph$: BehaviorSubject<Graph> = new BehaviorSubject(null);
  private events$: Subject<Events> = new Subject();
  private edgeUpdateFunctions: Map<string, Function> = new Map();
  private portsStatus: Map<IPortDescriptor, BehaviorSubject<PortStatus>> = new Map();
  private portSelections$: BehaviorSubject<PortSelections> = new BehaviorSubject({
    input: new Set(),
    output: new Set()
  });

  public static getInstance(): ConnectionsController {
    if (!ConnectionsController.instance) {
      ConnectionsController.instance = new ConnectionsController();
    }
    return ConnectionsController.instance;
  }

  private constructor() {
    this.currentGraph$.pipe(distinctUntilChanged()).subscribe((newGraph) => (newGraph && this.events$.next(Events.SetGraph)));
    this.portSelections$.subscribe(selections => this.createConnections(selections));
    this.portSelections$.subscribe(selections => console.log("current selections", selections));
  }

  private createPortStatus$(descriptor: IPortDescriptor): BehaviorSubject<PortStatus> {
    return new BehaviorSubject({
      descriptor,
      ref: null,
      isSelected: false,
      isActive: false,
    });
  } 

  private createConnections(selections: PortSelections) {
    const currentGraph = this.currentGraph$.getValue();
    for(const inputPort of selections.input) {
      for (const outputPort of selections.output) {
        currentGraph.createEdge(outputPort, inputPort);
        this.removeFromSelection(inputPort);
        this.removeFromSelection(outputPort);
      }
    }
  }

  public setGraph(graph: Graph): ConnectionsController {
    this.currentGraph$.next(graph);
    return this;
  }

  public setEdgeUpdateFunction(edgeUuid: string, updateFn: Function) {
    this.edgeUpdateFunctions.set(edgeUuid, updateFn);
  }

  public redrawConnections(nodeUuid: string) {
    this.currentGraph$.getValue().getConnectedEdges$(nodeUuid).subscribe((edges) => {
      for(const edge of edges) {
        if(this.edgeUpdateFunctions.has(edge.uuid)) {
          this.edgeUpdateFunctions.get(edge.uuid)();
        }
      }
    }).unsubscribe();
  }

  public getPortStatus$(portDescriptor: IPortDescriptor) {
    if (!this.portsStatus.has(portDescriptor)) {
      this.portsStatus.set(portDescriptor, this.createPortStatus$(portDescriptor));
    }
    return this.portsStatus.get(portDescriptor);
  }

  protected createConnection(from: IPortDescriptor, to: IPortDescriptor) {
    this.currentGraph$.getValue() && this.currentGraph$.getValue().createEdge(from, to);
  }

  public addToSelection(port: IPortDescriptor) {
    if (this.portsStatus.has(port)) {
      const currentSelections = this.portSelections$.getValue();
      currentSelections[port.type].add(port);
      this.portSelections$.next(currentSelections);
      this.portsStatus.get(port).next({...this.portsStatus.get(port).getValue(), isSelected: true});
    }
  }

  public removeFromSelection(port: IPortDescriptor) {
    if (this.portsStatus.has(port)) {
      const currentSelections = this.portSelections$.getValue();
      currentSelections[port.type].delete(port);
      this.portSelections$.next(currentSelections);
      this.portsStatus.get(port).next({...this.portsStatus.get(port).getValue(), isSelected: false});
    }
  }

  public setPortReference(port: IPortDescriptor, reference: HTMLElement | null) {
    if (this.portsStatus.has(port)) {
      this.portsStatus.get(port).next({...this.portsStatus.get(port).getValue(), ref: reference});
    }
  }

}