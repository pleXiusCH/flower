import Graph from "./graph";
import { map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import ActivitiesListener$ from "./activitiesListener";

export enum FlowerEvent {
  TestEvent = "Test Event",
  GraphAdded = "Graph added",
}

export default class Flower extends ActivitiesListener$ {

  activeGraphs = new Map<string, Graph>();
  private events$: Subject<FlowerEvent> = new Subject();

  constructor() {
    super();
  }

  addGraph(graph = new Graph()) {
    this.activeGraphs.set(graph.getUuid(), graph);
    this.events$.next(FlowerEvent.GraphAdded);
    // this.composeActivites(`graph::${graph.getUuid()}`, graph.getActivities$());
    return this.getGraph(graph.getUuid());
  }

  fireTestEvent() {
    this.events$.next(FlowerEvent.TestEvent);
  }

  removeGraph(uuid: string) {
    this.checkIfGraphPresent(uuid);
    return this.activeGraphs.delete(uuid);
  }

  getGraphs() {
    return this.activeGraphs;
  }

  getGraph(uuid: string) {
    this.checkIfGraphPresent(uuid);
    return this.activeGraphs.get(uuid);
  }

  async executeGraph(uuid: string) {
    this.checkIfGraphPresent(uuid);
    return await this.activeGraphs.get(uuid)?.execute();
  }

  getStatistics() {
    
  }

  serializeGraph() {

  }

  private checkIfGraphPresent(uuid: string) {
    if (!this.activeGraphs.has(uuid)) {
      throw new Error(`No graph present with uuid: ${uuid}`);
    }
    return true;
  }
}