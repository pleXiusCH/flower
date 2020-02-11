import { IPortDescriptor, PortType } from "@plexius/flower-interfaces";
import ControllerInt from "./ControllerInt";
import Graph, { Edge } from "@plexius/flower-core/src";
import { Observable } from "react-use/lib/useObservable";

export default class ConnectionsController implements ControllerInt<ConnectionsController> {

  private static instance: ConnectionsController;
  private currentGraph: Graph = null;
  private currentConnections$: Observable<Map<string, Edge>>;
  private selectedPortsFrom: Set<IPortDescriptor> = new Set();
  private selectedPortsTo: Set<IPortDescriptor> = new Set();
  private selectedPorts: Map<PortType, Set<IPortDescriptor>>;

  private constructor() { 
    this.selectedPorts = new Map([
      [PortType.Input, this.selectedPortsTo],
      [PortType.Output, this.selectedPortsFrom]
    ]);
  }

  public static getInstance(): ConnectionsController {
    if (!ConnectionsController.instance) {
      ConnectionsController.instance = new ConnectionsController();
    }
    return ConnectionsController.instance;
  }

  public setGraph(graph: Graph): ConnectionsController {
    this.currentGraph = graph;
    this.currentConnections$ = graph.getEdges$();
    return this;
  }

  protected createConnection(from: IPortDescriptor, to: IPortDescriptor) {
    return this.currentGraph && this.currentGraph.createEdge(from, to);
  }

  protected autowireConnections() {
    if (this.selectedPortsFrom.size > 0 && this.selectedPortsTo.size > 0) {
      for (const fromPort of this.selectedPortsFrom) {
        for (const toPort of this.selectedPortsTo) {
          this.createConnection(fromPort, toPort);
        }
      }
      this.selectedPortsFrom.clear();
      this.selectedPortsTo.clear();
    }
  }

  public activate(descriptor: IPortDescriptor, type: PortType) {
    this.selectedPorts.get(type).add(descriptor);
    return true;
  }

  public deactivate(descriptor: IPortDescriptor, type: PortType) {
    this.selectedPorts.get(type).delete(descriptor);
    return true;
  }

}