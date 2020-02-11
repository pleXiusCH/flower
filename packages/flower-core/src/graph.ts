import { INodeImpl, IPortDescriptor } from "@plexius/flower-interfaces";
import { BehaviorSubject, Observable, OperatorFunction } from "rxjs";
import Edge from "./edge";
import Node from "./node";

export default class Graph {
  private nodes$: BehaviorSubject<Map<string, Node>> = new BehaviorSubject(
    new Map(),
  );
  private edges$: BehaviorSubject<Map<string, Edge>> = new BehaviorSubject(
    new Map(),
  );

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
    this.edges$.next(new Map([...this.edges$.getValue(), [edge.uuid, edge]]));
    return edge;
  }

  public getNodeProperty$(port: IPortDescriptor): Observable<any> {
    return new Observable();
  }

  public getNode(nodeId: string): Node {
    return this.nodes$.getValue().get(nodeId);
  }

  public getNodes$() {
    return this.nodes$.asObservable();
  }

  public getEdges$() {
    return this.edges$.asObservable();
  }
}
