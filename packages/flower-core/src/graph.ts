import { INodeImpl, IPortDescriptor } from "@plexius/flower-interfaces";
import { BehaviorSubject, OperatorFunction } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import Edge from "./edge";
import Node from "./node";
import { map, distinct } from "rxjs/operators";
import ActivitiesListener$ from "./activitiesListener";

export default class Graph extends ActivitiesListener$ {
  private uuid: string = uuidv4();
  private nodes$: BehaviorSubject<Map<string, Node>> = new BehaviorSubject(
    new Map(),
  );
  private edges$: BehaviorSubject<Map<string, Edge>> = new BehaviorSubject(
    new Map(),
  );

  public getUuid() {
    return this.uuid;
  }

  public async execute() {
    return new Promise((resolve, reject) => {
      this.nodes$.subscribe(nodes => {
        resolve([...nodes].map(([uuid, node]) => ({
            nodeUuid: uuid,
            outputs: node.getOutputValues(),
        })).filter(n => n.outputs.length >= 1));
      }, err => reject(err)).unsubscribe();
    });
  }

  public createNode(nodeImpl: INodeImpl): Node {
    const node = new Node(nodeImpl);
    this.nodes$.next(new Map([...this.nodes$.getValue(), [node.uuid, node]]));
    return node;
  }

  public createEdge<T = any>(
    from: IPortDescriptor,
    to: IPortDescriptor,
    modifier?: OperatorFunction<T, T>,
  ): Edge<T> {
    const edge = new Edge<T>(this, from, to);
    if (modifier) {
      edge.useModifier(modifier);
    }
    this.composeActivites(`edge::${edge.uuid}`, edge.getActivities$());
    this.edges$.next(new Map([...this.edges$.getValue(), [edge.uuid, edge]]));
    return edge;
  }

  public getNode(nodeId: string): Node {
    return this.nodes$.getValue().get(nodeId)!;
  }

  public getEdge(edgeId: string): Edge {
    return this.edges$.getValue().get(edgeId)!;
  }

  public getNodes$() {
    return this.nodes$.asObservable();
  }

  public getEdges$() {
    return this.edges$.asObservable();
  }

  public getConnectedEdges$(nodeUuid: string) {
    const targetNode = this.getNode(nodeUuid);
    return this.getEdges$().pipe(
      map(edges => [...edges.values()].filter(edge => this.getConnectedNodes(edge).has(targetNode))), 
      distinct()
    );
  }

  private getConnectedNodes(edge: Edge) {
    edge.destinationPortDescriptor.nodeId
    const connectedNodes: Set<Node> = new Set();
    for(const [nodeUuid, node] of this.nodes$.getValue()) {
      if (nodeUuid === edge.destinationPortDescriptor.nodeId || nodeUuid === edge.sourcePortDescriptor.nodeId) {
        connectedNodes.add(node);
      }
    }
    return connectedNodes;
  }
}
